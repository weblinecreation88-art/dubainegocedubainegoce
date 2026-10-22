'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Badge } from '../ui/badge';
import { ProductImage } from './product-image';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { useWishlist } from '@/context/wishlist-context';
import { cn } from '@/lib/utils';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

function getStockStatus(stock: number): { label: string; className: string; inStock: boolean } {
    if (stock <= 0) {
        return { label: 'Rupture de stock', className: 'bg-red-700 text-white', inStock: false };
    }
    if (stock <= 3) {
        return { label: `Plus que ${stock} en stock`, className: 'bg-amber-700 text-white', inStock: true };
    }
    return { label: 'En stock', className: 'bg-[#46a74e] text-white', inStock: true };
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const stockStatus = getStockStatus(product.stock);
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isFavorite = isInWishlist(product.id);

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    const mainNotes = [
        ...(product.topNotes || []),
        ...(product.heartNotes || []),
        ...(product.baseNotes || []),
    ].slice(0, 3);

    return (
        <div className="storefront-product product-container flex flex-col h-full bg-white rounded border border-[#e4dac9] transition-all duration-200 hover:shadow-md hover:border-[#d4a017] group">
            <Link href={`/parfum/${product.slug}`} className="flex flex-col flex-grow">
                {/* Image nette sur fond clair */}
                <div className="storefront-product-photo relative aspect-square w-full overflow-hidden bg-[#fdfaf4] border-b border-[#e4dac9]/60">
                    <ProductImage
                        alt={`Parfum ${product.brand.name} ${product.name} - ${product.volumeMl}ml`}
                        images={product.images}
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        priority={priority}
                    />

                    {/* Badges Bestseller / Nouveau */}
                    <div className="storefront-product-badges absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {product.isBestseller && (
                            <Badge className="bg-[#111827] text-[#d4a017] hover:bg-[#111827] rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-[#d4a017]/40">
                                Sélection
                            </Badge>
                        )}
                        {product.isNew && (
                            <Badge className="bg-[#d4a017] text-white hover:bg-[#b88911] rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                Nouveau
                            </Badge>
                        )}
                    </div>

                    {/* Bouton Favoris */}
                    <button
                        type="button"
                        onClick={handleWishlistClick}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 border border-[#e4dac9] hover:border-[#d4a017] transition-colors z-20 group/heart"
                        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                        <Heart
                            className={cn(
                                'h-4 w-4 transition-colors',
                                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover/heart:text-red-500'
                            )}
                        />
                    </button>
                </div>

                {/* Informations homogènes : Marque, Nom, Contenance exacte, Notes */}
                <div className="storefront-product-info p-3.5 flex-grow flex flex-col justify-between text-center">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 truncate">
                            {product.brand.name}
                        </p>
                        <h3 className="text-sm font-headline font-bold text-[#111827] leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#d4a017] transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-[11px] text-gray-600 mt-1 font-medium">
                            Eau de Parfum • {product.volumeMl || 100} ml
                        </p>
                        {mainNotes.length > 0 ? (
                            <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                                Notes : {mainNotes.join(', ')}
                            </p>
                        ) : (
                            <p className="text-[11px] text-gray-500 mt-1 capitalize">
                                Famille : {product.family} ({product.gender})
                            </p>
                        )}
                    </div>

                    {/* Disponibilité & Prix TTC */}
                    <div className="storefront-product-price pt-3 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1', stockStatus.className)}>
                            {stockStatus.inStock && <Check className="h-3 w-3 stroke-[3]" />}
                            {stockStatus.label}
                        </span>
                        <p className="text-base sm:text-lg font-extrabold text-[#111827]">
                            {product.price.toFixed(2)} €
                        </p>
                    </div>
                </div>
            </Link>

            {/* Bouton d'achat visible */}
            <div className="storefront-product-buy px-3 pb-3">
                {product.stock > 0 ? (
                    <AddToCartButton
                        product={product}
                        className="w-full rounded-[2px] text-xs font-bold tracking-wider uppercase py-2.5 gap-2 bg-[#111827] text-white hover:bg-[#d4a017] hover:text-[#111827] transition-colors shadow-sm"
                    >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Ajouter au panier
                    </AddToCartButton>
                ) : (
                    <div className="w-full py-2 text-center text-[11px] font-semibold tracking-wider uppercase text-gray-500 bg-gray-50 border border-gray-200 rounded-[2px]">
                        Indisponible
                    </div>
                )}
            </div>
        </div>
    );
}
