'use client';

import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe, Truck } from 'lucide-react';
import { getMondialRelayInternationalCost, getColissimoCost } from '@/lib/data';
import { SUPPORTED_COUNTRIES, type SupportedCountry } from '@/lib/mondial-relay';
import { cn } from '@/lib/utils';

interface CountryShippingSelectorProps {
  totalWeight: number;
  onCountryChange: (country: SupportedCountry) => void;
  onShippingChange: (method: string) => void;
  selectedCountry?: SupportedCountry;
  selectedShipping?: string;
}

export function CountryShippingSelector({
  totalWeight,
  onCountryChange,
  onShippingChange,
  selectedCountry = 'FR',
  selectedShipping = 'mondial-relay'
}: CountryShippingSelectorProps) {
  const [country, setCountry] = useState<SupportedCountry>(selectedCountry);
  const [shippingMethod, setShippingMethod] = useState(selectedShipping);

  // Calculate shipping costs based on country
  const shippingOptions = useMemo(() => {
    const isFrance = country === 'FR';

    const options: Array<{
      id: string;
      name: string;
      description: string;
      cost: number;
      icon: typeof Globe;
      delivery: string;
    }> = [];

    if (isFrance) {
      // France - both options available
      options.push(
        {
          id: 'mondial-relay',
          name: 'Mondial Relay',
          description: 'Livraison en point relais',
          cost: require('@/lib/data').getMondialRelayCost(totalWeight),
          icon: Globe,
          delivery: '3-5 jours'
        },
        {
          id: 'colissimo',
          name: 'Colissimo',
          description: 'Livraison à domicile',
          cost: getColissimoCost(totalWeight),
          icon: Truck,
          delivery: '48h'
        }
      );
    } else {
      // International - only Mondial Relay
      const cost = getMondialRelayInternationalCost(country, totalWeight);
      options.push({
        id: 'mondial-relay-intl',
        name: 'Mondial Relay',
        description: 'Livraison en point relais',
        cost: cost,
        icon: Globe,
        delivery: '4-7 jours'
      });
    }

    return options;
  }, [country, totalWeight]);

  const handleCountryChange = (value: string) => {
    const newCountry = value as SupportedCountry;
    setCountry(newCountry);
    onCountryChange(newCountry);

    // Reset shipping method for international
    if (newCountry !== 'FR' && shippingMethod === 'colissimo') {
      setShippingMethod('mondial-relay-intl');
      onShippingChange('mondial-relay-intl');
    }
  };

  const handleShippingChange = (value: string) => {
    setShippingMethod(value);
    onShippingChange(value);
  };

  return (
    <div className="space-y-4">
      {/* Country Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Pays de livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez votre pays" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_COUNTRIES).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Shipping Method Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Mode de livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={shippingMethod} onValueChange={handleShippingChange}>
            <div className="space-y-3">
              {shippingOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.id}
                    className={cn(
                      'flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors',
                      shippingMethod === option.id
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{option.name}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Livraison en {option.delivery}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-sm">
                            {option.cost === 0 ? 'Gratuit' : `${option.cost.toFixed(2)}€`}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Info Message for International */}
      {country !== 'FR' && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            ℹ️ Votre commande sera livrée dans un point relais Mondial Relay dans votre pays en {4}-{7} jours ouvrables.
          </p>
        </div>
      )}
    </div>
  );
}
