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
}

export default function ShopPageContent({ products, brands, families, genders }: ShopPageContentProps) {
    const searchParams = useSearchParams();
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const activeFilters = useMemo(() => {
        const filters: { [key: string]: Set<string> } = {
            brands: new Set(searchParams.getAll('brands')),
            families: new Set(searchParams.getAll('families')),
            genders: new Set(searchParams.getAll('genders')),
        };
        return filters;
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
        
        return filtered;

    }, [products, activeFilters]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sort) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'newest':
                default:
                    return b.id.localeCompare(a.id); // Assuming higher ID is newer
            }
        });
    }, [filteredProducts, sort]);
    
    const FilterComponent = (
        <Filters brands={brands} families={families} genders={genders} />
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline">Notre Collection</h1>
                <p className="text-muted-foreground mt-2">
                    Explorez un monde de senteurs uniques et trouvez votre signature.
                </p>
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
                            Affichage de {sortedProducts.length} produit(s)
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
                                        <Button onClick={() => setIsSheetOpen(false)} className="w-full">Voir les résultats</Button>
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
