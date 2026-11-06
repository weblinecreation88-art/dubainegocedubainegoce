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
import { Lock, Truck, Store, MapPin, AlertCircle } from 'lucide-react';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { PickupPointSelector } from './pickup-point-selector';
import { PaymentBadges } from '@/components/ui/payment-badges';

const checkoutSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  phone: z.string().regex(/^[\d\s\+\-\(\)]{8,}$/, 'Numéro de téléphone invalide (minimum 8 caractères)').min(1, 'Téléphone requis'),
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
  totalAmount?: number;
  shippingCost?: number;
  mondialRelayCost?: number;
  colissimoCost?: number;
  onCountryChange?: (country: string) => void;
  onShippingMethodChange?: (method: 'colissimo' | 'mondial-relay') => void;
  onPickupPointChange?: (point: MondialRelayPickupPoint | null) => void;
}

export function CheckoutForm({
  onSubmit,
  initialEmail = '',
  initialData,
  isLoading = false,
  totalAmount,
  shippingCost = 0,
  mondialRelayCost,
  colissimoCost,
  onCountryChange,
  onShippingMethodChange,
  onPickupPointChange,
}: CheckoutFormProps) {
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<MondialRelayPickupPoint | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

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
      shippingMethod: initialData?.shippingMethod || 'mondial-relay',
    },
    mode: 'onChange',
  });

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
  const watchedPostalCode = form.watch('postalCode');

  useEffect(() => {
    onCountryChange?.(selectedCountry);
  }, [selectedCountry, onCountryChange]);

  useEffect(() => {
    onShippingMethodChange?.(selectedMethod);
  }, [selectedMethod, onShippingMethodChange]);

  const handleSelectPickupPoint = (point: MondialRelayPickupPoint | null) => {
    setSelectedPickupPoint(point);
    setValidationError(null);
    onPickupPointChange?.(point);
  };

  const handleSubmit = async (data: CheckoutFormData) => {
    if (data.shippingMethod === 'mondial-relay' && !selectedPickupPoint) {
      setValidationError('Veuillez sélectionner un point relais ou un Locker sur la carte ci-dessous avant de procéder au paiement.');
      const mapElem = document.getElementById('Zone_Widget');
      if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setValidationError(null);
    onSubmit(data, data.shippingMethod === 'mondial-relay' ? selectedPickupPoint : null);
  };

  return (
    <div className="space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* 1. Vos coordonnées & Adresse de facturation/domicile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">1. Vos coordonnées &amp; Adresse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (suivi de commande) *</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" placeholder="votre.email@exemple.com" {...field} />
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
                      <FormLabel>Téléphone mobile (SMS d&apos;arrivée du colis) *</FormLabel>
                      <FormControl>
                        <Input type="tel" autoComplete="tel" placeholder="06 12 34 56 78" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input autoComplete="given-name" placeholder="Jean" {...field} />
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
                        <Input autoComplete="family-name" placeholder="Dupont" {...field} />
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
                    <FormLabel>Adresse complète (Numéro et rue) *</FormLabel>
                    <FormControl>
                      <Input autoComplete="street-address" placeholder="123 Rue de la Paix" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Pays *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          {/* 2. Choix du mode de livraison : Mondial Relay vs Colissimo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">2. Mode de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option Mondial Relay (Moins cher, le préféré des clients) */}
                <div
                  onClick={() => form.setValue('shippingMethod', 'mondial-relay', { shouldValidate: true })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedMethod === 'mondial-relay'
                      ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent'
                      : 'border-border hover:border-accent/40 bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-accent/20 text-accent shrink-0">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-1.5">
                          <span>Mondial Relay</span>
                          <span className="text-[10px] bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 font-bold px-1.5 py-0.5 rounded">
                            Économique
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">Point Relais &amp; Lockers 24/7 (3-4j)</div>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-accent shrink-0">
                      {mondialRelayCost === 0 ? (
                        <span className="text-green-600 font-extrabold">OFFERTE</span>
                      ) : (
                        `${(mondialRelayCost ?? 4.10).toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  <div className="mt-3 text-[11px] text-muted-foreground">
                    ✓ Carte interactive disponible ci-dessous
                  </div>
                </div>

                {/* Option Colissimo Domicile */}
                <div
                  onClick={() => form.setValue('shippingMethod', 'colissimo', { shouldValidate: true })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedMethod === 'colissimo'
                      ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent'
                      : 'border-border hover:border-accent/40 bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-muted text-foreground shrink-0">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Colissimo Domicile</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Livraison boîte aux lettres (48h)</div>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-foreground shrink-0">
                      {colissimoCost === 0 ? (
                        <span className="text-green-600 font-extrabold">OFFERTE</span>
                      ) : (
                        `${(colissimoCost ?? 7.10).toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  <div className="mt-3 text-[11px] text-muted-foreground">
                    Livré directement chez vous par La Poste
                  </div>
                </div>
              </div>

              {/* Sélecteur de carte Mondial Relay */}
              {selectedMethod === 'mondial-relay' && (
                <div className="pt-3 border-t">
                  <div className="mb-2 font-semibold text-sm flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>Sélectionnez votre Locker ou Point Relais :</span>
                  </div>

                  <PickupPointSelector
                    country={selectedCountry}
                    postalCode={watchedPostalCode}
                    onSelectPoint={handleSelectPickupPoint}
                    selectedPointId={selectedPickupPoint?.id}
                  />

                  {validationError && (
                    <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 rounded-lg text-xs text-red-700 dark:text-red-300 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bouton direct vers Stripe */}
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base font-bold shadow-md"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Ouverture du paiement sécurisé Stripe...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Payer ma commande{totalAmount !== undefined ? ` (${totalAmount.toFixed(2)} € TTC)` : ''} — CB / Apple Pay
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground space-y-2 pt-1">
            <PaymentBadges title="Paiement 100% sécurisé via Stripe :" badgeClassName="h-6" />
          </div>
        </form>
      </Form>
    </div>
  );
}
