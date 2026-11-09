'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProductGrid } from '@/components/shop/product-grid';
import { Filters } from '@/components/shop/filters';
import { Sort } from '@/components/shop/sort';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Filter, Truck, ShieldCheck, HelpCircle } from 'lucide-react';
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
    title = 'Catalogue des Parfums',
    description = 'Explorez les parfums des maisons de Dubaï et filtrez selon vos envies.',
}: ShopPageContentProps) {
    const searchParams = useSearchParams();
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { globalMin, globalMax } = useMemo(() => {
        const prices = products.map((p) => p.price);
        return {
            globalMin: Math.floor(Math.min(...prices)),
            globalMax: Math.ceil(Math.max(...prices)),
        };
    }, [products]);

    const activeFilters = useMemo(() => {
        return {
            q: (searchParams.get('q') || '').trim().toLowerCase(),
            brands: new Set(searchParams.getAll('brands')),
            families: new Set(searchParams.getAll('families')),
            genders: new Set(searchParams.getAll('genders')),
            priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!, 10) : null,
            priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!, 10) : null,
        };
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (activeFilters.q) {
            const q = activeFilters.q;
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.name.toLowerCase().includes(q) ||
                    p.family.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q)) ||
                    (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
            );
        }
        if (activeFilters.brands.size > 0) {
            filtered = filtered.filter((p) => activeFilters.brands.has(p.brand.name));
        }
        if (activeFilters.families.size > 0) {
            filtered = filtered.filter((p) => activeFilters.families.has(p.family));
        }
        if (activeFilters.genders.size > 0) {
            filtered = filtered.filter((p) => activeFilters.genders.has(p.gender));
        }
        if (activeFilters.priceMin !== null) {
            filtered = filtered.filter((p) => p.price >= activeFilters.priceMin!);
        }
        if (activeFilters.priceMax !== null) {
            filtered = filtered.filter((p) => p.price <= activeFilters.priceMax!);
        }

        return filtered;
    }, [products, activeFilters]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            // Garder les ruptures consultables, mais afficher les produits achetables d'abord.
            if ((a.stock > 0) !== (b.stock > 0)) return a.stock > 0 ? -1 : 1;
            switch (sort) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'bestsellers':
                    return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
                case 'newest':
                default:
                    return b.id.localeCompare(a.id);
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
        <div className="container mx-auto max-w-7xl px-4 py-6">
            {/* Fil d'Ariane PrestaShop */}
            <nav
                aria-label="Fil d'Ariane"
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#6f6559] mb-6 flex-wrap"
            >
                <Link href="/" className="hover:text-[#a8834f] font-medium">
                    Accueil
                </Link>
                <span className="text-gray-400">&gt;</span>
                <span className="text-[#1d1a16]">{title}</span>
                {activeFilters.q && (
                    <>
                        <span className="text-gray-400">&gt;</span>
                        <span className="text-[#1d1a16]">Recherche : &laquo; {activeFilters.q} &raquo;</span>
                    </>
                )}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Colonne Gauche PrestaShop sur ordinateur : Filtres + Infos pratiques */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6">
                    <div className="bg-white">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#6f6559] pb-3 border-b border-[#1d1a16]/20">Filtrer</h2>
                        <div className="pt-4">
                            {FilterComponent}
                        </div>
                    </div>

                    {/* Rappel sobre des conditions de livraison */}
                    <div className="bg-[#faf7f2] overflow-hidden">
                        <h3 className="px-4 pt-4 text-[10px] uppercase tracking-[0.2em] text-[#6f6559]">Informations commande</h3>
                        <div className="p-4 space-y-3 text-xs text-gray-700">
                            <div className="flex items-start gap-2.5">
                                <Truck className="h-4 w-4 text-[#a8834f] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-[#1d1a16] block">Livraison Mondial Relay suivie</strong>
                                    <span>1 parfum : dès 4,10 €</span>
                                    <span className="block font-bold text-[#46a74e] mt-0.5">
                                        Offerte dès 2 parfums
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5 pt-2 border-t border-[#e6ded1]">
                                <ShieldCheck className="h-4 w-4 text-[#a8834f] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-[#1d1a16] block">Flacons neufs sous blister</strong>
                                    <span>Retour accepté sous 14 jours (produit non ouvert).</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-[#e6ded1]">
                                <Link href="/faq" className="inline-flex items-center gap-1.5 font-bold text-[#1d1a16] hover:text-[#a8834f]">
                                    <HelpCircle className="h-3.5 w-3.5 text-[#a8834f]" />
                                    <span>Consulter la FAQ</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Colonne Principale Catalogue (9/12) */}
                <main className="lg:col-span-9 space-y-5">
                    {/* En-tête de catégorie */}
                    <div className="pb-2">
                        <h1 className="text-[40px] sm:text-[52px] leading-[1.05] font-headline font-normal text-[#1d1a16]">{title}</h1>
                        <p className="text-sm text-[#5d564c] mt-3 max-w-2xl leading-relaxed">{description}</p>
                    </div>

                    {/* Barre de tri et filtre mobile (.content_sortPagiBar) */}
                    <div className="border-y border-[#e6ded1] py-3 flex flex-wrap justify-between items-center gap-3">
                        <p className="text-xs text-[#5d564c]">
                            Il y a <span className="text-[#1d1a16]">{sortedProducts.length}</span> produit{sortedProducts.length !== 1 ? 's' : ''}
                        </p>

                        <div className="flex items-center gap-2.5">
                            {/* Bouton Filtres Mobile */}
                            <div className="lg:hidden">
                                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="bg-white border-[#1d1a16]/40 rounded-none text-[#1d1a16] font-normal text-xs h-9">
                                            <Filter className="mr-1.5 h-3.5 w-3.5 text-[#a8834f]" />
                                            Filtrer
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="p-0 flex flex-col bg-white text-[#1d1a16]">
                                        <SheetHeader className="p-5 bg-[#f3ede3] border-b border-[#e6ded1]">
                                            <SheetTitle className="font-headline font-normal text-2xl text-[#1d1a16] text-left">Filtrer les parfums</SheetTitle>
                                            <SheetDescription className="sr-only">
                                                Appliquez des filtres par marque, genre ou famille olfactive
                                            </SheetDescription>
                                        </SheetHeader>
                                        <ScrollArea className="flex-1 p-4">
                                            {FilterComponent}
                                        </ScrollArea>
                                        <SheetFooter className="p-4 border-t border-[#e6ded1] bg-[#faf7f2]">
                                            <Button
                                                onClick={() => setIsSheetOpen(false)}
                                                className="w-full bg-[#a8834f] hover:bg-[#8c6c3f] text-white font-bold uppercase text-xs"
                                            >
                                                Afficher les {sortedProducts.length} parfums
                                            </Button>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            <Sort onSortChange={setSort} />
                        </div>
                    </div>

                    {/* Grille de produits */}
                    <ProductGrid products={sortedProducts} />
                </main>
            </div>
        </div>
    );
}
