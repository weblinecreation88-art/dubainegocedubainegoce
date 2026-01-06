
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Truck, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Helper pour ajouter des jours ouvrés
function addBusinessDays(startDate: Date, days: number): Date {
  const date = new Date(startDate.valueOf());
  let addedDays = 0;
  while (addedDays < days) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Dimanche, 6 = Samedi
      addedDays++;
    }
  }
  return date;
}

// Helper pour calculer l'estimation de livraison
const getDeliveryEstimate = (order: Order): string | null => {
  if (!order.shippingMethod || !order.orderDate) return null;

  const orderDate = new Date(order.orderDate);
  // On considère un délai de préparation de 2 jours ouvrés
  const shippingDate = addBusinessDays(orderDate, 2); 

  let minDays: number, maxDays: number;

  switch (order.shippingMethod) {
    case 'colissimo':
      minDays = 2;
      maxDays = 3;
      break;
    case 'mondial-relay':
      minDays = 3;
      maxDays = 5;
      break;
    default:
      return null;
  }

  const minDeliveryDate = addBusinessDays(shippingDate, minDays);
  const maxDeliveryDate = addBusinessDays(shippingDate, maxDays);
  
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };

  return `entre le ${minDeliveryDate.toLocaleDateString('fr-FR', options)} et le ${maxDeliveryDate.toLocaleDateString('fr-FR', options)}`;
};


export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/orders`), orderBy('orderDate', 'desc'));
  }, [firestore, user]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/account/orders');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || areOrdersLoading) {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Skeleton className="h-6 w-48 mb-8" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center text-sm text-muted-foreground">
            <Link href="/account" className="hover:text-primary">Mon Compte</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Mes Commandes</span>
        </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Mes Commandes</CardTitle>
          <CardDescription>
            Consultez l'historique de vos achats passés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
                {orders.map((order) => {
                    const deliveryEstimate = getDeliveryEstimate(order);
                    return (
                        <AccordionItem value={order.id} key={order.id} className="border rounded-lg bg-card">
                            <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left">
                                    <div className="mb-2 md:mb-0">
                                        <p className="font-semibold">Commande du {new Date(order.orderDate).toLocaleDateString('fr-FR')}</p>
                                        <p className="text-xs text-muted-foreground">ID: {order.id}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-lg">{order.totalAmount.toFixed(2)} €</p>
                                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="capitalize">{order.status === 'completed' ? 'Confirmée' : order.status}</Badge>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                <Separator className="mb-4" />
                                {deliveryEstimate && (
                                    <div className="flex items-center gap-3 text-sm bg-secondary/50 p-3 rounded-md mb-4">
                                        <Truck className="h-5 w-5 text-primary" />
                                        <div>
                                            <span className="font-semibold">Livraison estimée :</span> {deliveryEstimate}
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                                <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">{(item.itemPrice * item.quantity).toFixed(2)} €</p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
          ) : (
             <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-headline">Aucune commande pour le moment</h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                Vous n'avez pas encore passé de commande. Explorez nos parfums pour trouver votre bonheur !
                </p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
