'use client';

import { useState } from 'react';
import { AddToCartButton } from './add-to-cart-button';
import type { Product } from '@/lib/types';
import { Minus, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentBadges } from '@/components/ui/payment-badges';
import { useWishlist } from '@/context/wishlist-context';
import { cn } from '@/lib/utils';

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-wider text-gray-600 font-bold">Quantité :</span>
        <div className="flex items-center border border-[#e4dac9] bg-white rounded-[2px]">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none border-r border-[#e4dac9] hover:bg-[#f7f0e6]"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center font-bold text-sm text-[#111827]">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none border-l border-[#e4dac9] hover:bg-[#f7f0e6]"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <AddToCartButton
        product={product}
        quantity={quantity}
        size="lg"
        className="w-full h-12 bg-[#d4a017] hover:bg-[#b88911] text-white font-bold uppercase tracking-wider text-xs sm:text-sm rounded-[2px] shadow"
        showPrice={true}
      >
        Ajouter au panier
      </AddToCartButton>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        className="w-full py-2 px-3 rounded-[2px] border border-[#e4dac9] bg-white hover:bg-[#fdfaf4] text-xs font-semibold text-[#111827] flex items-center justify-center gap-2 transition-colors"
      >
        <Heart className={cn('h-4 w-4', isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500')} />
        <span>{isFavorite ? 'Retirer de mes favoris' : 'Ajouter à mes favoris'}</span>
      </button>

      {/* Badges de paiement réellement proposés */}
      <div className="pt-3 border-t border-[#e4dac9]">
        <PaymentBadges title="Moyens de paiement sécurisés :" badgeClassName="h-6" />
      </div>
    </div>
  );
}
