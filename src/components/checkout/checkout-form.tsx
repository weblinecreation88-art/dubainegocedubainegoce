'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
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
import { Lock, Loader2, Store, Truck, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { PickupPointSelector } from './pickup-point-selector';
import { PaymentBadges } from '@/components/ui/payment-badges';

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
  totalAmount?: number;
  shippingCost?: number;
  mondialRelayCost?: number;
  colissimoCost?: number;
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
  totalAmount,
  mondialRelayCost,
  colissimoCost,
  onCountryChange,
  onShippingMethodChange,
  onPickupPointChange,
  submitLabel,
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
      setValidationError('Veuillez sélectionner votre point relais ou Locker Mondial Relay ci-dessous avant de procéder au paiement.');
      const mapElem = document.getElementById('Zone_Widget') || document.getElementById('mondial-relay-section');
      if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setValidationError(null);
    onSubmit(data, data.shippingMethod === 'mondial-relay' ? selectedPickupPoint : null);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* SECTION 1: Coordonnées & Adresse */}
          <div className="space-y-4 rounded-none border border-[#d9cfbf] bg-white p-5 sm:p-6 [&_label]:text-xs [&_label]:font-normal [&_label]:text-[#1d1a16] [&_input]:h-12 [&_input]:rounded-none [&_input]:border-[#d9cfbf] [&_input]:bg-white [&_input]:text-[15px] [&_input:focus-visible]:ring-0 [&_input:focus-visible]:border-[#1d1a16] [&_button[role=combobox]]:h-12 [&_button[role=combobox]]:rounded-none [&_button[role=combobox]]:border-[#d9cfbf]">
            <div className="border-b border-[#eee7dc] pb-3">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-[#1d1a16]">
                1. Vos coordonnées &amp; adresse de facturation
              </h2>
              <p className="text-xs text-[#6f6559] mt-0.5">
                Vos coordonnées seront mémorisées pour vos prochaines commandes en 1 clic.
              </p>
            </div>

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
                    <FormLabel>Email (suivi de commande) *</FormLabel>
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
                    <FormLabel>Téléphone mobile (SMS suivi / livraison) *</FormLabel>
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
                  <FormLabel>Adresse complète (Numéro et voie) *</FormLabel>
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
          </div>

          {/* SECTION 2: Choix du mode de livraison */}
          <div id="mondial-relay-section" className="space-y-4 rounded-none border border-[#d9cfbf] bg-white p-5 sm:p-6">
            <div className="border-b border-[#eee7dc] pb-3">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-[#1d1a16]">
                2. Choisissez votre mode de livraison
              </h2>
              <p className="text-xs text-[#6f6559] mt-0.5">
                Sélectionnez le transporteur de votre choix.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option Mondial Relay */}
              <button
                type="button"
                onClick={() => {
                  form.setValue('shippingMethod', 'mondial-relay', { shouldValidate: true });
                  setValidationError(null);
                }}
                className={`text-left p-4 rounded-none border transition-all relative ${
                  selectedMethod === 'mondial-relay'
                    ? 'border-[#1d1a16] bg-[#fbf9f5] ring-1 ring-[#1d1a16]'
                    : 'border-[#d9cfbf] hover:border-[#1d1a16]/60 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-[#eee7dc] text-[#1d1a16] shrink-0">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#1d1a16] flex items-center gap-1.5">
                        <span>Mondial Relay</span>
                        <span className="text-[10px] bg-[#e7f3ec] text-[#1b6b3e] font-semibold px-1.5 py-0.5 rounded">
                          Économique
                        </span>
                      </div>
                      <div className="text-xs text-[#6f6559] mt-0.5">Point Relais &amp; Lockers 24/7 (3-4 jours)</div>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#1d1a16] shrink-0">
                    {mondialRelayCost === 0 ? (
                      <span className="text-[#1b6b3e] font-bold">OFFERTE</span>
                    ) : (
                      `${(mondialRelayCost ?? 4.10).toFixed(2)} €`
                    )}
                  </span>
                </div>
                <div className="mt-3 text-[11px] text-[#6f6559] flex items-center gap-1">
                  <span>✓ Carte interactive des relais ci-dessous</span>
                </div>
              </button>

              {/* Option Colissimo */}
              <button
                type="button"
                onClick={() => {
                  form.setValue('shippingMethod', 'colissimo', { shouldValidate: true });
                  setValidationError(null);
                }}
                className={`text-left p-4 rounded-none border transition-all relative ${
                  selectedMethod === 'colissimo'
                    ? 'border-[#1d1a16] bg-[#fbf9f5] ring-1 ring-[#1d1a16]'
                    : 'border-[#d9cfbf] hover:border-[#1d1a16]/60 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-[#eee7dc] text-[#1d1a16] shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#1d1a16]">Colissimo Domicile</div>
                      <div className="text-xs text-[#6f6559] mt-0.5">Boîte aux lettres (48h ouvrées)</div>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#1d1a16] shrink-0">
                    {colissimoCost === 0 ? (
                      <span className="text-[#1b6b3e] font-bold">OFFERTE</span>
                    ) : (
                      `${(colissimoCost ?? 7.10).toFixed(2)} €`
                    )}
                  </span>
                </div>
                <div className="mt-3 text-[11px] text-[#6f6559]">
                  Livré chez vous par votre facteur La Poste
                </div>
              </button>
            </div>

            {/* Sélecteur de carte Mondial Relay */}
            {selectedMethod === 'mondial-relay' && (
              <div className="pt-4 border-t border-[#eee7dc] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#1d1a16] flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#b8955f]" />
                    <span>Sélectionnez votre Point Relais ou Locker :</span>
                  </div>
                  {selectedPickupPoint && (
                    <span className="text-xs text-[#1b6b3e] font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Point sélectionné
                    </span>
                  )}
                </div>

                <PickupPointSelector
                  country={selectedCountry}
                  postalCode={watchedPostalCode}
                  onSelectPoint={handleSelectPickupPoint}
                  selectedPointId={selectedPickupPoint?.id}
                />

                {validationError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bouton de paiement sécurisé */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#b8955f] hover:bg-[#a8834f] disabled:opacity-60 text-[#1d1a16] h-[52px] px-4 text-xs uppercase tracking-[0.14em] font-semibold transition-colors shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirection sécurisée vers le paiement…
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  {submitLabel || (totalAmount !== undefined
                    ? `Payer ma commande (${totalAmount.toFixed(2)} €) — CB / Apple Pay`
                    : 'Payer ma commande en toute sécurité')}
                </>
              )}
            </button>

            <div className="text-center text-xs text-[#6f6559] pt-1">
              <PaymentBadges title="Paiement 100% sécurisé via Stripe :" badgeClassName="h-6" />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
