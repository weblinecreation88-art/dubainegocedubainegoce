'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Lock } from 'lucide-react';
import { formatCurrency, getShippingMethodLabel } from '@/lib/checkout-utils';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
  shippingMethod: string;
  selectedPickupPoint?: MondialRelayPickupPoint | null;
  onSubmit: () => void;
  isLoading?: boolean;
  isFormValid?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  vat,
  shipping,
  total,
  shippingMethod,
  selectedPickupPoint,
  onSubmit,
  isLoading = false,
  isFormValid = true,
}: OrderSummaryProps) {
  return (
    <div className="space-y-4 sticky top-4">
      {/* Order Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Votre panier ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-3 border-b last:pb-0 last:border-0">
              {item.image && (
                <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold flex-shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Résumé du paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {/* VAT */}
          <div className="flex justify-between items-center text-sm p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-800">
            <span className="font-semibold text-amber-700 dark:text-amber-300">TVA (20%)</span>
            <span className="font-bold text-amber-700 dark:text-amber-300">{formatCurrency(vat)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {getShippingMethodLabel(shippingMethod)}
            </span>
            <span className="font-medium">{formatCurrency(shipping)}</span>
          </div>

          <Separator className="my-2" />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold text-accent">
            <span>Total TTC</span>
            <span className="text-2xl">{formatCurrency(total)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Pickup Point Info (if selected) */}
      {shippingMethod === 'mondial-relay' && selectedPickupPoint && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">📍 Lieu de retrait</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-semibold">{selectedPickupPoint.name}</p>
            <p className="text-muted-foreground">{selectedPickupPoint.address}</p>
            <p className="text-muted-foreground">
              {selectedPickupPoint.postalCode} {selectedPickupPoint.city}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        disabled={isLoading || !isFormValid}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 font-semibold text-base"
        size="lg"
      >
        {isLoading ? (
          <>
            <span className="animate-spin inline-block mr-2">⏳</span>
            Traitement en cours...
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Procéder au paiement sécurisé
          </>
        )}
      </Button>

      {/* Security Info */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>🔒 Paiement sécurisé par Stripe</p>
        <p>✅ 100% Authentique | 💚 Retour 14 jours</p>
      </div>
    </div>
  );
}
