'use client';

import React from 'react';
import { useWishlist } from '@/context/wishlist-context';
import { getProducts } from '@/lib/data';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
    const { wishlist } = useWishlist();
    const allProducts = getProducts();
    const favoriteProducts = allProducts.filter((p) => wishlist.includes(p.id));

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh]">
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl font-headline font-bold mb-4">Mes Favoris</h1>
                <p className="text-muted-foreground">Retrouvez ici tous les parfums qui vous ont fait craquer.</p>
            </div>

            {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favoriteProducts.map((product) => (
                        <div key={product.id} className="relative">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                        <Heart className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Votre liste est vide</h2>
                    <p className="text-muted-foreground mb-8 max-w-md">
                        Vous n'avez pas encore ajouté de parfums à vos favoris.
                        Explorez notre collection pour trouver votre prochain coup de cœur.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/shop" className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            Découvrir la boutique
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
