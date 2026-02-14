

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { AddToCartButton } from './add-to-cart-button';
import { Badge } from '../ui/badge';
import { ProductImage } from './product-image';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group flex flex-col h-full bg-white transition-all duration-700">
            <Link href={`/parfum/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
                <ProductImage
                    alt={product.name}
                    images={product.images}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-contain p-8 transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Subtle Luxury Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isBestseller && (
                        <span className="bg-black text-white text-[8px] uppercase tracking-widest px-3 py-1 font-luxury-body">
                            Best-seller
                        </span>
                    )}
                    {product.isNew && (
                        <span className="bg-[#D4AF37] text-white text-[8px] uppercase tracking-widest px-3 py-1 font-luxury-body">
                            Nouveau
                        </span>
                    )}
                </div>

                {/* Quick Add Overlay - Luxury Style */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/80 backdrop-blur-sm">
                    <AddToCartButton product={product} className="w-full btn-primary-modern py-2 text-[8px]" />
                </div>
            </Link>

            <div className="py-6 space-y-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-luxury-body">
                    {product.brand.name}
                </p>
                <h3 className="text-lg font-luxury-headline text-black tracking-wide group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {product.name}
                </h3>

                {/* Olfactory Notes for better guidance */}
                <div className="flex flex-wrap justify-center gap-1.5 px-4">
                    <span className="text-[9px] uppercase tracking-wider text-black/40 border border-black/5 px-2 py-0.5 rounded-full">
                        {product.family}
                    </span>
                    {(product.topNotes || []).slice(0, 2).map((note, i) => (
                        <span key={i} className="text-[9px] uppercase tracking-wider text-black/40 border border-black/5 px-2 py-0.5 rounded-full">
                            {note}
                        </span>
                    ))}
                </div>

                <p className="text-sm font-luxury-body text-black/60 pt-2">
                    {product.price.toFixed(2)} €
                </p>
            </div>
        </div>
    );
}
