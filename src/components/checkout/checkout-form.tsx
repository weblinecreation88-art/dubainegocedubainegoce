'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { PickupPointSelector } from './pickup-point-selector';

// Form Schema - Complet avec code postal pour Colissimo & Mondial Relay
const checkoutSchema = z.object({
  // Step 1: Personal Info
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  phone: z.string().regex(/^[\d\s\+\-\(\)]{8,}$/, 'Numéro de téléphone invalide (minimum 8 caractères)').min(1, 'Téléphone requis'),

  // Step 2: Address
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  address: z.string().min(5, 'Adresse requise'),
  postalCode: z.string().min(3, 'Code postal requis (ex: 75001)'),
  city: z.string().min(2, 'Ville requise'),
  country: z.string().min(2, 'Pays requis'),

  // Step 3: Shipping
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
}

export function CheckoutForm({
  onSubmit,
  initialEmail = '',
  initialData,
  isLoading = false,
  onCountryChange,
  onShippingMethodChange,
  onPickupPointChange,
}: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<MondialRelayPickupPoint | null>(null);

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

  // L'adresse enregistree peut arriver apres l'affichage du formulaire :
  // on complete seulement les champs encore vides.
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

  // Notify parent of changes
  useEffect(() => {
    onCountryChange?.(selectedCountry);
  }, [selectedCountry, onCountryChange]);

  useEffect(() => {
    onShippingMethodChange?.(selectedMethod);
  }, [selectedMethod, onShippingMethodChange]);

  useEffect(() => {
    onPickupPointChange?.(selectedPickupPoint);
  }, [selectedPickupPoint, onPickupPointChange]);

  // Validate current step
  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 1) {
      return await form.trigger(['email', 'phone', 'firstName', 'lastName', 'address', 'postalCode', 'city', 'country']);
    } else if (step === 2) {
      return await form.trigger(['shippingMethod']);
    }
    return true;
  };

  const handleNext = async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, 2));
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async (data: CheckoutFormData) => {
    onSubmit(data, selectedPickupPoint);
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex gap-2">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step < currentStep
                  ? 'bg-accent text-accent-foreground'
                  : step === currentStep
                  ? 'bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step < currentStep ? <Check className="h-4 w-4" /> : step}
            </div>
            {step < 2 && <div className={`flex-1 h-0.5 ${step < currentStep ? 'bg-accent' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Step 1: Personal Info + Address (Merged) */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>📧 Vos informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="votre.email@exemple.com" {...field} />
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
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 6 12 34 56 78" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🏠 Adresse de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean" {...field} />
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
                            <Input placeholder="Dupont" {...field} />
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
                        <FormLabel>Adresse *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Rue de la Paix" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

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
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Shipping Method (no pickup point selection) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>🚚 Mode de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            {/* Colissimo - France only */}
                            {selectedCountry === 'FR' && (
                              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                                <RadioGroupItem value="colissimo" id="colissimo" />
                                <Label htmlFor="colissimo" className="flex-1 cursor-pointer">
                                  <div className="font-semibold">📦 Colissimo</div>
                                  <div className="text-sm text-muted-foreground">
                                    Livraison à domicile - 48h en France métropolitaine
                                  </div>
                                </Label>
                              </div>
                            )}

                            {/* Mondial Relay - All countries */}
                            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                              <RadioGroupItem value="mondial-relay" id="mondial-relay" />
                              <Label htmlFor="mondial-relay" className="flex-1 cursor-pointer">
                                <div className="font-semibold">🛒 Mondial Relay</div>
                                <div className="text-sm text-muted-foreground">
                                  Retrait en point relais - Confirmation par SMS
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Sélecteur Mondial Relay */}
              {selectedMethod === 'mondial-relay' && (
                <PickupPointSelector
                  country={selectedCountry}
                  onSelectPoint={setSelectedPickupPoint}
                  selectedPointId={selectedPickupPoint?.id}
                />
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>

            {currentStep < 2 && (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                type="submit"
                disabled={isLoading || (selectedMethod === 'mondial-relay' && !selectedPickupPoint)}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Procéder au paiement
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
