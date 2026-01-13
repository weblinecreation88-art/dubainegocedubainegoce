

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
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl group bg-white rounded-2xl border border-gray-200">
            <Link href={`/parfum/${product.slug}`} className="flex flex-col flex-grow">
                <CardHeader className="p-0">
                    <div className="aspect-[3/4] w-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <ProductImage
                            alt={product.name}
                            images={product.images}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isBestseller && <Badge className="bg-[#c58a3d] text-white hover:bg-[#b67a2d] font-semibold">Best-seller</Badge>}
                            {product.isNew && <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600 font-semibold">Nouveau</Badge>}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow space-y-2">
                    {/* Catégorie en jaune */}
                    <p className="text-xs font-bold uppercase tracking-wider text-[#c58a3d]">
                        {product.family || 'Fragrances Orientales'}
                    </p>

                    {/* Titre du produit */}
                    <CardTitle className="text-xl font-headline font-bold text-gray-900 group-hover:text-[#c58a3d] transition-colors leading-tight">
                        {product.name}
                    </CardTitle>

                    {/* Marque */}
                    <CardDescription className="text-sm text-gray-600 font-medium">
                        {product.brand.name}
                    </CardDescription>
                </CardContent>
            </Link>
            <CardFooter className="p-6 pt-0 flex flex-col items-start gap-4">
                 <p className="text-2xl font-bold text-gray-900">{product.price.toFixed(2)} €</p>
                <AddToCartButton product={product} className="w-full bg-gradient-to-r from-[#c58a3d] to-[#b67a2d] hover:from-[#b67a2d] hover:to-[#a56a1d] text-white transition-all duration-300 font-bold rounded-xl py-3 shadow-lg hover:shadow-xl hover:scale-105" />
            </CardFooter>
        </Card>
    );
}
