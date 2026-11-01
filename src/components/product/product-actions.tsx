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
        <div className="flex items-center border border-[#e6ded1] bg-white rounded-[2px]">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none border-r border-[#e6ded1] hover:bg-[#f3ede3]"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center font-bold text-sm text-[#1d1a16]">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none border-l border-[#e6ded1] hover:bg-[#f3ede3]"
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
        className="w-full h-12 bg-[#a8834f] hover:bg-[#8c6c3f] text-white font-bold uppercase tracking-wider text-xs sm:text-sm rounded-[2px] shadow"
        showPrice={true}
      >
        Ajouter au panier
      </AddToCartButton>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        className="w-full py-2 px-3 rounded-[2px] border border-[#e6ded1] bg-white hover:bg-[#faf7f2] text-xs font-semibold text-[#1d1a16] flex items-center justify-center gap-2 transition-colors"
      >
        <Heart className={cn('h-4 w-4', isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500')} />
        <span>{isFavorite ? 'Retirer de mes favoris' : 'Ajouter à mes favoris'}</span>
      </button>

      {/* Badges de paiement réellement proposés */}
      <div className="pt-3 border-t border-[#e6ded1]">
        <PaymentBadges title="Moyens de paiement sécurisés :" badgeClassName="h-6" />
      </div>
    </div>
  );
}
