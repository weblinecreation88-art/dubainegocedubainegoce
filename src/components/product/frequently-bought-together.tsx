'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Gift } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { getComboDiscountText } from '@/lib/product-recommendations';
import { useToast } from '@/hooks/use-toast';

interface FrequentlyBoughtTogetherProps {
  products: Product[];
  currentProduct: Product;
}

export function FrequentlyBoughtTogether({ products, currentProduct }: FrequentlyBoughtTogetherProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!products || products.length === 0) {
    return null;
  }

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleAddComboToCart = () => {
    // Ajouter le produit actuel
    addToCart({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images[0] || '',
      slug: currentProduct.slug,
      quantity: 1,
    });

    // Ajouter les produits sélectionnés
    selectedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '',
          slug: product.slug,
          quantity: 1,
        });
      }
    });

    const totalItems = selectedProducts.size + 1;
    toast({
      title: '✅ Panier mis à jour!',
      description: `${totalItems} produit(s) ajoutés au panier avec +5% de réduction combo!`,
    });

    setSelectedProducts(new Set());
  };

  const totalPrice = Array.from(selectedProducts)
    .reduce((sum, productId) => {
      const product = products.find(p => p.id === productId);
      return sum + (product?.price || 0);
    }, currentProduct.price);

  const discountAmount = (totalPrice * 0.05);
  const finalPrice = totalPrice - discountAmount;

  return (
    <div className="mt-16 p-8 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Gift className="h-5 w-5 text-accent" />
          <h3 className="text-2xl font-headline font-bold">Fréquemment achetés ensemble</h3>
          <Gift className="h-5 w-5 text-accent" />
        </div>
        <p className="text-sm text-muted-foreground">
          Complétez votre achat avec ces produits populaires de la même famille
        </p>
      </div>

      {/* Produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map(product => (
          <div
            key={product.id}
            className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              selectedProducts.has(product.id)
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50'
            }`}
            onClick={() => toggleProduct(product.id)}
          >
            {/* Checkbox */}
            <div className="absolute top-3 right-3 z-20">
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                  selectedProducts.has(product.id)
                    ? 'bg-accent border-accent'
                    : 'border-border'
                }`}
              >
                {selectedProducts.has(product.id) && (
                  <span className="text-accent-foreground text-sm font-bold">✓</span>
                )}
              </div>
            </div>

            {/* Produit */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pricing & CTA */}
      <div className="bg-background/50 rounded-lg p-6 border border-border">
        {/* Prix breakdown */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Produits sélectionnés ({selectedProducts.size + 1}):</span>
            <span className="font-semibold">{totalPrice.toFixed(2)} €</span>
          </div>

          {selectedProducts.size > 0 && (
            <>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-accent font-semibold">Votre réduction combo (-5%):</span>
                <span className="text-accent font-semibold">-{discountAmount.toFixed(2)} €</span>
              </div>

              <div className="h-px bg-accent/20" />
              <div className="flex justify-between items-center text-lg font-headline font-bold">
                <span>Prix final:</span>
                <span className="text-accent">{finalPrice.toFixed(2)} €</span>
              </div>
            </>
          )}
        </div>

        {/* Combo discount badge */}
        {selectedProducts.size > 0 && (
          <Badge variant="secondary" className="mb-6 w-full justify-center py-2">
            {getComboDiscountText(selectedProducts.size + 1)}
          </Badge>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleAddComboToCart}
          disabled={selectedProducts.size === 0}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 font-semibold text-base"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Ajouter {selectedProducts.size + 1} produit{selectedProducts.size > 0 ? 's' : ''} au panier
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Sélectionnez les produits que vous souhaitez ajouter avec votre commande
        </p>
      </div>
    </div>
  );
}
