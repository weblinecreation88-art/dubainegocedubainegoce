'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ListOrdered, User as UserIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/account');
    }
  }, [user, isUserLoading, router]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Card>
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-8 w-48 mt-4" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
          <h1 className="text-4xl font-headline">Mon Compte</h1>
          <p className="text-muted-foreground mt-2">Gérez vos informations et consultez vos commandes.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
           <Card>
             <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 text-3xl mb-4">
                    <AvatarFallback>{getInitials(user.displayName || user.email)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.displayName}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
             </CardHeader>
           </Card>
        </div>
        <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="hover:bg-accent/50 transition-colors">
                    <Link href="/account/orders">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <ListOrdered className="h-8 w-8 text-primary" />
                            <CardTitle className="text-xl">Mes Commandes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Suivez vos commandes en cours et consultez votre historique d'achats.
                            </p>
                        </CardContent>
                    </Link>
                </Card>
                 <Card className="hover:bg-accent/50 transition-colors">
                    <Link href="#">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <UserIcon className="h-8 w-8 text-primary" />
                            <CardTitle className="text-xl">Mon Profil</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Mettez à jour vos informations personnelles et votre mot de passe (bientôt disponible).
                            </p>
                        </CardContent>
                    </Link>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
