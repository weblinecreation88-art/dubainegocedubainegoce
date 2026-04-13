'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Truck, ChevronRight, Clock, CheckCircle, XCircle, RefreshCw, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function addBusinessDays(startDate: Date, days: number): Date {
  const date = new Date(startDate.valueOf());
  let addedDays = 0;
  while (addedDays < days) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) addedDays++;
  }
  return date;
}

const getDeliveryEstimate = (order: Order): string | null => {
  if (!order.shippingMethod || !order.orderDate) return null;
  const orderDate = new Date(order.orderDate);
  const shippingDate = addBusinessDays(orderDate, 2);
  let minDays: number, maxDays: number;
  switch (order.shippingMethod) {
    case 'colissimo': minDays = 2; maxDays = 3; break;
    case 'mondial-relay': minDays = 3; maxDays = 5; break;
    default: return null;
  }
  const minDate = addBusinessDays(shippingDate, minDays);
  const maxDate = addBusinessDays(shippingDate, maxDays);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  return `entre le ${minDate.toLocaleDateString('fr-FR', opts)} et le ${maxDate.toLocaleDateString('fr-FR', opts)}`;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: 'En attente',      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-3.5 w-3.5" /> },
  processing: { label: 'En préparation',  color: 'bg-blue-100 text-blue-800 border-blue-200',       icon: <RefreshCw className="h-3.5 w-3.5" /> },
  completed:  { label: 'Confirmée',       color: 'bg-green-100 text-green-800 border-green-200',    icon: <CheckCircle className="h-3.5 w-3.5" /> },
  cancelled:  { label: 'Annulée',         color: 'bg-red-100 text-red-800 border-red-200',          icon: <XCircle className="h-3.5 w-3.5" /> },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Package className="h-6 w-6 text-gray-400" />
      </div>
    );
  }
  return (
    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
      <Image src={src} alt={alt} fill sizes="64px" className="object-cover" />
    </div>
  );
}

export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/orders`), orderBy('orderDate', 'desc'));
  }, [firestore, user]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  if (isUserLoading || areOrdersLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/account" className="hover:text-primary">Mon Compte</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Mes Commandes</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Mes Commandes</CardTitle>
          <CardDescription>
            {orders && orders.length > 0
              ? `${orders.length} commande${orders.length > 1 ? 's' : ''} passée${orders.length > 1 ? 's' : ''}`
              : 'Historique de vos achats'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {orders.map((order) => {
                const deliveryEstimate = getDeliveryEstimate(order);
                const shippingLabel = order.shippingMethod === 'colissimo'
                  ? 'Colissimo' : order.shippingMethod === 'mondial-relay'
                  ? 'Mondial Relay' : order.shippingMethod;
                const addr = order.shippingAddress;
                const addressLine = addr
                  ? [addr.address1 || addr.line1, addr.city, addr.postal_code || addr.postalCode].filter(Boolean).join(', ')
                  : null;

                return (
                  <AccordionItem value={order.id} key={order.id} className="border rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left gap-2">
                        <div>
                          <p className="font-semibold text-sm">
                            Commande du {new Date(order.orderDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {order.orderItems.length} article{order.orderItems.length > 1 ? 's' : ''} · {order.totalAmount.toFixed(2)} €
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-4 pt-0">
                      <Separator className="mb-4" />

                      {deliveryEstimate && order.status !== 'cancelled' && (
                        <div className="flex items-center gap-3 text-sm bg-blue-50 border border-blue-100 p-3 rounded-lg mb-3">
                          <Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span><span className="font-medium">Livraison estimée :</span> {deliveryEstimate}</span>
                        </div>
                      )}

                      {order.trackingNumber && (
                        <div className="flex items-center gap-3 text-sm bg-green-50 border border-green-100 p-3 rounded-lg mb-3">
                          <Package className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <div>
                            <span className="font-medium">N° de suivi : </span>
                            {order.trackingUrl ? (
                              <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                {order.trackingNumber}
                              </a>
                            ) : (
                              <span className="font-mono">{order.trackingNumber}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {addressLine && (
                        <div className="flex items-start gap-3 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Adresse de livraison</p>
                            {(addr?.firstName || addr?.lastName) && (
                              <p>{[addr?.firstName, addr?.lastName].filter(Boolean).join(' ')}</p>
                            )}
                            <p>{addressLine}</p>
                          </div>
                        </div>
                      )}

                      {shippingLabel && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <Truck className="h-4 w-4 flex-shrink-0" />
                          <span>Livraison par <span className="font-medium">{shippingLabel}</span></span>
                        </div>
                      )}

                      <Separator className="my-3" />

                      <div className="space-y-3">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <ProductImage src={item.image} alt={item.name} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qté : {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-sm flex-shrink-0">
                              {(item.itemPrice * item.quantity).toFixed(2)} €
                            </p>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center font-semibold text-base">
                        <span>Total</span>
                        <span>{order.totalAmount.toFixed(2)} €</span>
                      </div>

                      <div className="mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/contact">Contacter le support</Link>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-headline">Aucune commande pour le moment</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Vous n'avez pas encore passé de commande.
              </p>
              <Button asChild className="mt-4">
                <Link href="/shop/all">Découvrir nos parfums</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
