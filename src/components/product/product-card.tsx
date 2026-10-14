'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Badge } from '../ui/badge';
import { ProductImage } from './product-image';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/context/wishlist-context';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

function getStockBadge(stock: number): { label: string; className: string } | null {
    // Teintes -700 : red-500 et orange-500 sur blanc n'atteignent pas le
    // contraste 4.5:1 exige pour du texte de petite taille (WCAG AA).
    if (stock <= 0) return { label: 'Rupture de stock', className: 'bg-red-700 text-white' };
    if (stock <= 3) return { label: `Plus que ${stock} en stock`, className: 'bg-red-700 text-white' };
    if (stock <= 7) return { label: 'Stock limité', className: 'bg-orange-700 text-white' };
    return null;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const stockBadge = getStockBadge(product.stock);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isFavorite = isInWishlist(product.id);

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-card rounded-md overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 group text-center">
            <Link href={`/parfum/${product.slug}`} className="flex flex-col flex-grow">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-black/20">
                    <ProductImage
                        alt={`Parfum ${product.brand.name} ${product.name} - Dubai Negoce`}
                        images={product.images}
                        sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        priority={priority}
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                        {product.isBestseller && <Badge className="bg-black text-white hover:bg-black/80 rounded-sm px-1.5 py-0 text-[10px] font-medium tracking-wide">TOP</Badge>}
                        {product.isNew && <Badge variant="secondary" className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-sm px-1.5 py-0 text-[10px] font-medium tracking-wide">NOUV</Badge>}
                    </div>
                    <button
                        onClick={handleWishlistClick}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors z-20 group/heart"
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                        <Heart className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/heart:text-red-500")} />
                    </button>
                    {stockBadge && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm ${stockBadge.className}`}>
                                {stockBadge.label}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-4 flex-grow flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1.5 truncate w-full">{product.brand.name}</p>
                    <h3 className="text-sm font-headline font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#c9a96e] transition-colors">
                        {product.name}
                    </h3>
                </div>
                <div className="px-4 pb-3 mt-auto">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{product.price.toFixed(2)} €</p>
                </div>
            </Link>
            {/* Quick add — outside Link to avoid nested navigation */}
            {product.stock > 0 ? (
                <div className="px-3 pb-3">
                    <AddToCartButton
                        product={product}
                        className="w-full rounded text-xs font-bold tracking-wider uppercase py-2.5 sm:py-3 gap-2 bg-black text-white hover:bg-black/90 transition-colors shadow-sm"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Ajouter
                    </AddToCartButton>
                </div>
            ) : (
                <div className="px-3 pb-3">
                    <div className="w-full py-2 text-center text-[11px] tracking-wider uppercase text-muted-foreground border border-gray-200 rounded-sm">
                        Rupture de stock
                    </div>
                </div>
            )}
        </div>
    );
}
