'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

/** Barre d'ajout au panier fixee en bas de l'ecran sur mobile (fiche produit). */
export function StickyMobileAddToCart({ product }: { product: Product }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const isOutOfStock = product.stock <= 0;

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      image: product.images?.[0] || '/dubainegoce.png',
      quantity: 1,
    });
    setIsAdded(true);
    toast({
      title: 'Ajouté au panier !',
      description: `${product.name} a été ajouté à votre panier.`,
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border p-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {product.images?.[0] && (
            <div className="relative w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
              <Image src={product.images[0]} alt={product.name} fill sizes="40px" className="object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate text-foreground">{product.name}</p>
            <p className="text-xs font-bold text-accent">{product.price.toFixed(2)} € TTC</p>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          size="sm"
          disabled={isOutOfStock}
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-4 py-2 flex items-center gap-1.5 shrink-0"
        >
          {isOutOfStock ? (
            'Rupture'
          ) : isAdded ? (
            <>
              <Check className="h-4 w-4" />
              Ajouté !
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Ajouter
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
