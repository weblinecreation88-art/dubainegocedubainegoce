

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Badge } from '../ui/badge';
import { ProductImage } from './product-image';

interface ProductCardProps {
    product: Product;
}

function getStockBadge(stock: number): { label: string; className: string } | null {
    if (stock <= 0) return { label: 'Rupture de stock', className: 'bg-red-500 text-white' };
    if (stock <= 3) return { label: `Plus que ${stock} en stock`, className: 'bg-red-500 text-white' };
    if (stock <= 7) return { label: 'Stock limité', className: 'bg-orange-500 text-white' };
    return null;
}

export function ProductCard({ product }: ProductCardProps) {
    const stockBadge = getStockBadge(product.stock);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-card rounded-md overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 group text-center">
            <Link href={`/parfum/${product.slug}`} className="flex flex-col flex-grow">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-black/20">
                    <ProductImage
                        alt={product.name}
                        images={product.images}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                        {product.isBestseller && <Badge className="bg-black text-white hover:bg-black/80 rounded-sm px-1.5 py-0 text-[10px] font-medium tracking-wide">TOP</Badge>}
                        {product.isNew && <Badge variant="secondary" className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-sm px-1.5 py-0 text-[10px] font-medium tracking-wide">NOUV</Badge>}
                    </div>
                    {stockBadge && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm ${stockBadge.className}`}>
                                {stockBadge.label}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-3 flex-grow flex flex-col items-center justify-between">
                    <div className="w-full">
                        <p className="text-xs text-muted-foreground font-medium mb-1 truncate">{product.brand.name}</p>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:underline decoration-1 underline-offset-2">
                            {product.name}
                        </h3>

                        {/* Notes olfactives / Famille */}
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                            {product.family && (
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 after:content-['•'] after:mx-1 last:after:hidden">
                                    {product.family}
                                </span>
                            )}
                            {product.tags?.filter(t => t.toLowerCase() !== 'dupe').slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="text-[10px] text-gray-500 dark:text-gray-400 after:content-['•'] after:mx-1 last:after:hidden capitalize">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {product.volumeMl > 0 && (
                            <p className="text-xs text-gray-400 mt-1">{product.volumeMl} ml</p>
                        )}
                    </div>
                </div>
                <div className="px-3 pb-4 mt-auto">
                    <p className="text-base font-bold text-gray-900 dark:text-white">{product.price.toFixed(2)} €</p>
                </div>
            </Link>
        </div>
    );
}
