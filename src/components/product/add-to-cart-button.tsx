'use client';

import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product;
    quantity?: number;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined,
    className?: string;
    children?: React.ReactNode;
}

export function AddToCartButton({ product, quantity = 1, size = "default", className, children }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            slug: product.slug,
            image: product.images[0] || 'https://picsum.photos/seed/placeholder/800/800',
            quantity: quantity,
        });

        toast({
            title: "Ajouté au panier !",
            description: `${product.name} a bien été ajouté à votre panier.`,
        });
    };

    return (
        <Button onClick={handleAddToCart} size={size} className={className}>
            {children || <>
                <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter
            </>}
        </Button>
    );
}
