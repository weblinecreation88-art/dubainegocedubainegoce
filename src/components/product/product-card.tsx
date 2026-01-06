

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
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg group">
            <Link href={`/parfum/${product.slug}`} className="flex flex-col flex-grow">
                <CardHeader className="p-0 border-b">
                    <div className="aspect-square w-full relative overflow-hidden">
                        <ProductImage
                            alt={product.name}
                            images={product.images}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-2">
                            {product.isBestseller && <Badge>Best-seller</Badge>}
                            {product.isNew && <Badge variant="secondary">Nouveau</Badge>}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors min-h-[2.5em]">
                        {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">{product.brand.name}</CardDescription>
                </CardContent>
            </Link>
            <CardFooter className="p-4 pt-0 flex flex-col items-start gap-4">
                 <p className="text-xl font-bold text-primary">{product.price.toFixed(2)} €</p>
                <AddToCartButton product={product} className="w-full" />
            </CardFooter>
        </Card>
    );
}
