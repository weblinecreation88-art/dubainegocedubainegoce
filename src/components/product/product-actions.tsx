'use client';

import { useState } from 'react';
import { AddToCartButton } from './add-to-cart-button';
import { PayPalButton } from './paypal-button';
import type { Product } from '@/lib/types';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground font-medium">Quantité :</span>
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none border-r"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium text-base">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none border-l"
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <AddToCartButton
        product={product}
        quantity={quantity}
        size="lg"
        className="w-full"
        variant="accent"
        isStockCritical={product.stock <= 2}
        showPrice={true}
      >
        Ajouter au panier
      </AddToCartButton>

      {/* Bouton PayPal (séparateur inclus dans le composant) */}
      <PayPalButton
        price={product.price}
        productName={product.name}
        quantity={quantity}
      />
    </div>
  );
}
