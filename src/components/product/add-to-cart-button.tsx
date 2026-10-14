'use client';

import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
    product: Product;
    quantity?: number;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent",
    className?: string;
    children?: React.ReactNode;
    isStockCritical?: boolean; // Add pulse animation if stock < 3
    showPrice?: boolean; // Show price in button
    isSticky?: boolean; // Make button sticky on mobile
}

export function AddToCartButton({
    product,
    quantity = 1,
    size = "default",
    variant = "default",
    className,
    children,
    isStockCritical = false,
    showPrice = false,
    isSticky = false
}: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [isAdded, setIsAdded] = useState(false);

    // Un produit en rupture ne doit jamais pouvoir etre commande.
    const isOutOfStock = product.stock <= 0;

    const handleAddToCart = async () => {
        if (isOutOfStock) {
            toast({
                variant: 'destructive',
                title: 'Produit indisponible',
                description: `${product.name} est actuellement en rupture de stock.`,
            });
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            slug: product.slug,
            image: product.images[0] || 'https://picsum.photos/seed/placeholder/800/800',
            quantity: quantity,
        });

        // Show success animation
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);

        toast({
            title: "Ajouté au panier !",
            description: `${product.name} a bien été ajouté à votre panier.`,
        });
    };

    const buttonContent = isOutOfStock ? (
        <>Rupture de stock</>
    ) : children || <>
        {isAdded ? (
            <>
                <Check className="mr-2 h-4 w-4" /> Ajouté!
            </>
        ) : (
            <>
                <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter
                {showPrice && <span className="ml-auto font-bold">{product.price.toFixed(2)}€</span>}
            </>
        )}
    </>;

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            size={size}
            variant={variant}
            className={cn(
                className,
                isStockCritical && !isOutOfStock && 'animate-pulse',
                isSticky && 'sticky bottom-4 left-4 right-4 z-40 shadow-lg',
                isAdded && 'ring-2 ring-green-500'
            )}
            data-checkout-button
        >
            {buttonContent}
        </Button>
    );
}
