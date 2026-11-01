'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { ProductImage } from './product-image';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/wishlist-context';
import { cn } from '@/lib/utils';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

// Seules les informations utiles à la décision restent visibles : le stock n'apparaît
// que lorsqu'il devient limité.
function getStockNote(stock: number): { label: string; className: string } | null {
    if (stock <= 0) return { label: 'Rupture de stock', className: 'text-[#a33333]' };
    if (stock <= 3) return { label: `Plus que ${stock} en stock`, className: 'text-[#8a5a1c]' };
    return null;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const stockNote = getStockNote(product.stock);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isFavorite = isInWishlist(product.id);

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    return (
        <div className="storefront-product product-container group flex flex-col h-full min-w-0">
            <Link href={`/parfum/${product.slug}`} className="flex flex-col flex-grow">
                <div className="storefront-product-photo relative aspect-[4/5] w-full overflow-hidden bg-[#f3ede3]">
                    <ProductImage
                        alt={`Parfum ${product.brand.name} ${product.name} - ${product.volumeMl}ml`}
                        images={product.images}
                        sizes="(max-width: 1024px) 48vw, 24vw"
                        className="object-contain p-6 sm:p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.04]"
                        priority={priority}
                    />

                    {product.isNew && (
                        <span className="absolute top-3 left-3 z-10 text-[9px] uppercase tracking-[0.18em] text-[#1d1a16] bg-white/85 px-2 py-1">
                            Nouveau
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={handleWishlistClick}
                        className="absolute top-2.5 right-2.5 z-20 p-2 text-[#1d1a16]/60 hover:text-[#1d1a16] transition-colors"
                        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                        <Heart className={cn('h-4 w-4', isFavorite && 'fill-[#a8834f] text-[#a8834f]')} />
                    </button>
                </div>

                <div className="storefront-product-info flex flex-col flex-grow pt-4">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#6f6559] mb-1.5 truncate">
                        {product.brand.name} · {product.volumeMl || 100} ml
                    </p>
                    <h3 className="font-headline font-normal text-[19px] sm:text-[22px] leading-[1.15] text-[#1d1a16] line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="mt-2.5 text-sm font-medium text-[#1d1a16] tabular-nums">
                        {product.price.toFixed(2).replace('.', ',')} €
                    </p>
                    {stockNote && <p className={cn('mt-1 text-[11px]', stockNote.className)}>{stockNote.label}</p>}
                </div>
            </Link>

            <div className="storefront-product-buy mt-3">
                {product.stock > 0 ? (
                    <AddToCartButton
                        product={product}
                        variant="ghost"
                        className="h-auto w-full justify-start rounded-none border-b border-[#1d1a16]/25 px-0 pb-2 pt-0 text-xs font-medium text-[#1d1a16] hover:bg-transparent hover:border-[#1d1a16] hover:text-[#1d1a16]"
                    >
                        Ajouter au panier
                    </AddToCartButton>
                ) : (
                    <p className="border-b border-[#1d1a16]/10 pb-2 text-xs text-[#6f6559]">Indisponible</p>
                )}
            </div>
        </div>
    );
}
