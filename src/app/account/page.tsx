'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, MapPin, User, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@/lib/types';
import Image from 'next/image';

const statusLabel: Record<string, string> = {
  pending: 'En attente',
  processing: 'En cours',
  completed: 'Confirmée',
  cancelled: 'Annulée',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  processing: 'secondary',
  completed: 'default',
  cancelled: 'destructive',
};

export default function AccountDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/orders`),
      orderBy('orderDate', 'desc'),
      limit(3)
    );
  }, [firestore, user]);

  const { data: recentOrders, isLoading } = useCollection<Order>(ordersQuery);

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'vous';

  return (
    <div className="space-y-6">
      {/* Message de bienvenue */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-700">
            Bonjour <span className="font-semibold">{firstName}</span> (pas vous ?{' '}
            <Link href="/login" className="text-primary underline underline-offset-2">
              Déconnexion
            </Link>
            )
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Depuis votre tableau de bord, vous pouvez consulter vos{' '}
            <Link href="/account/orders" className="text-primary underline underline-offset-2">commandes récentes</Link>,
            gérer vos{' '}
            <Link href="/account/addresses" className="text-primary underline underline-offset-2">adresses</Link>{' '}
            et modifier vos{' '}
            <Link href="/account/profile" className="text-primary underline underline-offset-2">informations personnelles</Link>.
          </p>
        </CardContent>
      </Card>

      {/* Accès rapide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/account/orders">
          <Card className="hover:border-black transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
              <Package className="h-8 w-8" />
              <p className="font-semibold text-sm">Mes Commandes</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/addresses">
          <Card className="hover:border-black transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
              <MapPin className="h-8 w-8" />
              <p className="font-semibold text-sm">Mes Adresses</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/profile">
          <Card className="hover:border-black transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
              <User className="h-8 w-8" />
              <p className="font-semibold text-sm">Mon Profil</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Dernières commandes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Commandes récentes</CardTitle>
          <Link href="/account/orders" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Tout voir <ChevronRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : recentOrders && recentOrders.length > 0 ? (
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-4 flex items-center gap-4">
                  {/* Miniatures produits */}
                  <div className="flex -space-x-2">
                    {order.orderItems.slice(0, 3).map((item, i) => (
                      <div key={i} className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white">
                        <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Commande du {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.orderItems.length} article(s)</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-semibold text-sm">{order.totalAmount.toFixed(2)} €</span>
                    <Badge variant={statusVariant[order.status] ?? 'secondary'}>
                      {statusLabel[order.status] ?? order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
              <Link href="/shop/all" className="text-sm text-primary underline underline-offset-2">
                Découvrir nos parfums
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
