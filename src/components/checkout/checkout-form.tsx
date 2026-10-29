'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Lock } from 'lucide-react';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';

const checkoutSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  phone: z
    .string()
    .regex(/^[\d\s\+\-\(\)\.]{8,}$/, 'Numéro de téléphone invalide (minimum 8 caractères)')
    .min(1, 'Téléphone requis'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  address: z.string().min(5, 'Adresse requise'),
  postalCode: z.string().min(3, 'Code postal requis (ex: 75001)'),
  city: z.string().min(2, 'Ville requise'),
  country: z.string().min(2, 'Pays requis'),
  shippingMethod: z.enum(['colissimo', 'mondial-relay']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

const COUNTRIES = [
  { code: 'FR', name: 'France' },
  { code: 'BE', name: 'Belgique' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'CH', name: 'Suisse' },
];

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData, pickupPoint: MondialRelayPickupPoint | null) => void;
  initialEmail?: string;
  initialData?: Partial<CheckoutFormData>;
  isLoading?: boolean;
  onCountryChange?: (country: string) => void;
  onShippingMethodChange?: (method: 'colissimo' | 'mondial-relay') => void;
  onPickupPointChange?: (point: MondialRelayPickupPoint | null) => void;
  submitLabel?: string;
}

export function CheckoutForm({
  onSubmit,
  initialEmail = '',
  initialData,
  isLoading = false,
  onCountryChange,
  onShippingMethodChange,
  onPickupPointChange,
  submitLabel,
}: CheckoutFormProps) {
  const [selectedPickupPoint] = useState<MondialRelayPickupPoint | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: initialData?.email || initialEmail,
      phone: initialData?.phone || '',
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      address: initialData?.address || '',
      postalCode: initialData?.postalCode || '',
      city: initialData?.city || '',
      country: initialData?.country || 'FR',
      shippingMethod: initialData?.shippingMethod || 'colissimo',
    },
    mode: 'onChange',
  });

  // L'adresse enregistrée peut arriver après l'affichage du formulaire :
  // on complète seulement les champs encore vides.
  useEffect(() => {
    if (!initialData) return;
    (Object.keys(initialData) as Array<keyof CheckoutFormData>).forEach((key) => {
      const value = initialData[key];
      if (value) {
        if (key === 'shippingMethod') {
          form.setValue('shippingMethod', value as 'colissimo' | 'mondial-relay', { shouldValidate: true });
        } else if (!form.getValues(key)) {
          form.setValue(key, value as never, { shouldValidate: false });
        }
      }
    });
  }, [initialData, form]);

  const selectedCountry = form.watch('country');
  const selectedMethod = form.watch('shippingMethod');

  useEffect(() => {
    onCountryChange?.(selectedCountry);
  }, [selectedCountry, onCountryChange]);

  useEffect(() => {
    onShippingMethodChange?.(selectedMethod);
  }, [selectedMethod, onShippingMethodChange]);

  useEffect(() => {
    onPickupPointChange?.(selectedPickupPoint);
  }, [selectedPickupPoint, onPickupPointChange]);

  const handleSubmit = async (data: CheckoutFormData) => {
    onSubmit(data, selectedPickupPoint);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🏠 Coordonnées de livraison</CardTitle>
              <p className="text-xs text-muted-foreground">
                Vos coordonnées seront mémorisées pour passer vos prochaines commandes en 1 clic.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" autoComplete="given-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" autoComplete="family-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (pour le suivi Colissimo) *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="votre.email@exemple.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone (pour le livreur) *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+33 6 12 34 56 78" autoComplete="tel" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Rue de la Paix" autoComplete="street-address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal *</FormLabel>
                      <FormControl>
                        <Input placeholder="75001" autoComplete="postal-code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Ville *</FormLabel>
                      <FormControl>
                        <Input placeholder="Paris" autoComplete="address-level2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Pays *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base font-bold shadow-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Redirection sécurisée vers le paiement...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                {submitLabel || 'Enregistrer et passer au paiement sécurisé'}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
