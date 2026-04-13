'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, MapPin, User, ChevronRight, ShoppingBag, TrendingUp, Clock, Lock } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@/lib/types';
import Image from 'next/image';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'En attente',     color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'En préparation', color: 'bg-blue-100 text-blue-800' },
  completed:  { label: 'Confirmée',      color: 'bg-green-100 text-green-800' },
  cancelled:  { label: 'Annulée',        color: 'bg-red-100 text-red-800' },
};

export default function AccountDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/orders`), orderBy('orderDate', 'desc'));
  }, [firestore, user]);

  const { data: allOrders, isLoading } = useCollection<Order>(ordersQuery);

  const recentOrders = allOrders?.slice(0, 3);
  const totalSpent = allOrders?.reduce((sum, o) => sum + o.totalAmount, 0) ?? 0;
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'vous';
  const isGoogleUser = user?.providerData?.some((p) => p.providerId === 'google.com');

  return (
    <div className="space-y-6">
      {/* Bienvenue */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-700">
            Bonjour <span className="font-semibold">{firstName}</span> (pas vous ?{' '}
            <Link href="/login" className="text-primary underline underline-offset-2">Déconnexion</Link>)
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Consultez vos{' '}
            <Link href="/account/orders" className="text-primary underline underline-offset-2">commandes</Link>,
            gérez vos{' '}
            <Link href="/account/addresses" className="text-primary underline underline-offset-2">adresses</Link>{' '}
            et modifiez vos{' '}
            <Link href="/account/profile" className="text-primary underline underline-offset-2">informations</Link>.
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
              <div>
                {isLoading ? <Skeleton className="h-6 w-12" /> : (
                  <p className="text-2xl font-bold">{allOrders?.length ?? 0}</p>
                )}
                <p className="text-xs text-muted-foreground">Commande{(allOrders?.length ?? 0) > 1 ? 's' : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                {isLoading ? <Skeleton className="h-6 w-16" /> : (
                  <p className="text-2xl font-bold">{totalSpent.toFixed(0)} €</p>
                )}
                <p className="text-xs text-muted-foreground">Total dépensé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accès rapide */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/account/orders">
          <Card className="hover:border-black transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
              <Package className="h-7 w-7" />
              <p className="font-semibold text-xs">Mes Commandes</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/addresses">
          <Card className="hover:border-black transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
              <MapPin className="h-7 w-7" />
              <p className="font-semibold text-xs">Mes Adresses</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/profile">
          <Card className="hover:border-black transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
              <User className="h-7 w-7" />
              <p className="font-semibold text-xs">Mon Profil</p>
            </CardContent>
          </Card>
        </Link>
        {!isGoogleUser && (
          <Link href="/account/profile#password">
            <Card className="hover:border-black transition-colors cursor-pointer h-full">
              <CardContent className="pt-5 flex flex-col items-center text-center gap-2">
                <Lock className="h-7 w-7" />
                <p className="font-semibold text-xs">Mot de passe</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Dernières commandes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Commandes récentes</CardTitle>
          <Link href="/account/orders" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Tout voir <ChevronRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : recentOrders && recentOrders.length > 0 ? (
            <div className="divide-y">
              {recentOrders.map((order) => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                return (
                  <div key={order.id} className="py-3 flex items-center gap-4">
                    <div className="flex -space-x-2 flex-shrink-0">
                      {order.orderItems.slice(0, 3).map((item, i) => (
                        item.image ? (
                          <div key={i} className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white">
                            <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                          </div>
                        ) : (
                          <div key={i} className="h-10 w-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <Package className="h-4 w-4 text-gray-400" />
                          </div>
                        )
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {order.orderItems.map(i => i.name).join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="font-semibold text-sm">{order.totalAmount.toFixed(2)} €</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 gap-3">
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
