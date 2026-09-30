'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/shop/product-grid';
import { Filters } from '@/components/shop/filters';
import { Sort } from '@/components/shop/sort';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import type { Product, Brand, FragranceFamily, GenderCategory } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface ShopPageContentProps {
    products: Product[];
    brands: Brand[];
    families: FragranceFamily[];
    genders: GenderCategory[];
    title?: string;
    description?: string;
}

export default function ShopPageContent({
    products,
    brands,
    families,
    genders,
    title = 'Notre Collection',
    description = 'Explorez un monde de senteurs uniques et trouvez votre signature.',
}: ShopPageContentProps) {
    const searchParams = useSearchParams();
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Compute global price range from product catalog
    const { globalMin, globalMax } = useMemo(() => {
        const prices = products.map(p => p.price);
        return {
            globalMin: Math.floor(Math.min(...prices)),
            globalMax: Math.ceil(Math.max(...prices)),
        };
    }, [products]);

    const activeFilters = useMemo(() => {
        return {
            brands: new Set(searchParams.getAll('brands')),
            families: new Set(searchParams.getAll('families')),
            genders: new Set(searchParams.getAll('genders')),
            priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : null,
            priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : null,
        };
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (activeFilters.brands.size > 0) {
            filtered = filtered.filter(p => activeFilters.brands.has(p.brand.name));
        }
        if (activeFilters.families.size > 0) {
            filtered = filtered.filter(p => activeFilters.families.has(p.family));
        }
        if (activeFilters.genders.size > 0) {
            filtered = filtered.filter(p => activeFilters.genders.has(p.gender));
        }
        if (activeFilters.priceMin !== null) {
            filtered = filtered.filter(p => p.price >= activeFilters.priceMin!);
        }
        if (activeFilters.priceMax !== null) {
            filtered = filtered.filter(p => p.price <= activeFilters.priceMax!);
        }

        return filtered;
    }, [products, activeFilters]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sort) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'bestsellers': return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
                case 'newest':
                default: return b.id.localeCompare(a.id);
            }
        });
    }, [filteredProducts, sort]);

    const FilterComponent = (
        <Filters
            brands={brands}
            families={families}
            genders={genders}
            minPrice={globalMin}
            maxPrice={globalMax}
        />
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline">{title}</h1>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Desktop Filters */}
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <h2 className="text-2xl font-headline">Filtres</h2>
                        <ScrollArea className="h-[calc(100vh-12rem)]">
                            {FilterComponent}
                        </ScrollArea>
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-muted-foreground">
                            {sortedProducts.length} produit{sortedProducts.length !== 1 ? 's' : ''}
                        </p>
                        {/* Mobile Filters Trigger */}
                        <div className="lg:hidden">
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filtres
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 flex flex-col">
                                    <SheetHeader className="p-4 border-b">
                                        <SheetTitle>Filtres</SheetTitle>
                                        <SheetDescription className="sr-only">Appliquez des filtres pour affiner les résultats</SheetDescription>
                                    </SheetHeader>
                                    <ScrollArea className="flex-1 p-4">
                                        {FilterComponent}
                                    </ScrollArea>
                                    <SheetFooter className="p-4 border-t">
                                        <Button onClick={() => setIsSheetOpen(false)} className="w-full">
                                            Voir les {sortedProducts.length} résultats
                                        </Button>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <Sort onSortChange={setSort} />
                    </div>
                    <ProductGrid products={sortedProducts} />
                </main>
            </div>
        </div>
    );
}
