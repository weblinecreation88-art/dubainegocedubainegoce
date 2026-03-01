'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const addressSchema = z.object({
  firstName: z.string().min(1, 'Requis'),
  lastName: z.string().min(1, 'Requis'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Requis'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Requis'),
  postalCode: z.string().min(4, 'Code postal invalide'),
  country: z.string().min(1, 'Requis'),
  phone: z.string().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

type AddressType = 'billing' | 'shipping';

function AddressCard({
  type,
  userId,
  firestore,
}: {
  type: AddressType;
  userId: string;
  firestore: ReturnType<typeof useFirestore>;
}) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '', lastName: '', company: '', address1: '',
      address2: '', city: '', postalCode: '', country: 'France', phone: '',
    },
  });

  useEffect(() => {
    if (!firestore) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(firestore, 'users', userId));
        if (snap.exists()) {
          const data = snap.data();
          const addr = data?.[`${type}Address`];
          if (addr) form.reset(addr);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [firestore, userId, type, form]);

  const onSubmit = async (data: AddressForm) => {
    if (!firestore) return;
    setIsSaving(true);
    try {
      setDocumentNonBlocking(
        doc(firestore, 'users', userId),
        { [`${type}Address`]: data },
        { merge: true }
      );
      toast({
        title: 'Adresse sauvegardée',
        description: `Votre adresse de ${type === 'billing' ? 'facturation' : 'livraison'} a été mise à jour.`,
      });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder l\'adresse.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const title = type === 'billing' ? 'Adresse de facturation' : 'Adresse de livraison';
  const description = type === 'billing'
    ? 'L\'adresse qui apparaîtra sur vos factures.'
    : 'L\'adresse où vos commandes seront expédiées.';

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl><Input placeholder="Jean" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl><Input placeholder="Dupont" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="company" render={({ field }) => (
              <FormItem>
                <FormLabel>Société <span className="text-muted-foreground text-xs">(optionnel)</span></FormLabel>
                <FormControl><Input placeholder="Nom de votre société" {...field} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="address1" render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl><Input placeholder="12 rue de la Paix" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address2" render={({ field }) => (
              <FormItem>
                <FormLabel>Complément d'adresse <span className="text-muted-foreground text-xs">(optionnel)</span></FormLabel>
                <FormControl><Input placeholder="Appartement, bâtiment…" {...field} /></FormControl>
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="postalCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal</FormLabel>
                  <FormControl><Input placeholder="75001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl><Input placeholder="Paris" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <FormControl><Input placeholder="France" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone <span className="text-muted-foreground text-xs">(optionnel)</span></FormLabel>
                <FormControl><Input type="tel" placeholder="+33 6 00 00 00 00" {...field} /></FormControl>
              </FormItem>
            )} />
            <Button type="submit" disabled={isSaving} className="rounded-none w-full sm:w-auto">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder l'adresse
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function AddressesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <AddressCard type="billing" userId={user.uid} firestore={firestore} />
      <AddressCard type="shipping" userId={user.uid} firestore={firestore} />
    </div>
  );
}
