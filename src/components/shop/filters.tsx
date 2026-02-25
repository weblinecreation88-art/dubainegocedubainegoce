'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Brand, FragranceFamily, GenderCategory } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface FiltersProps {
    brands: Brand[];
    families: FragranceFamily[]
    genders: GenderCategory[];
    minPrice?: number;
    maxPrice?: number;
}

export function Filters({ brands, families, genders, minPrice = 0, maxPrice = 200 }: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeBrands = new Set(searchParams.getAll('brands'));
    const activeFamilies = new Set(searchParams.getAll('families'));
    const activeGenders = new Set(searchParams.getAll('genders'));

    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');

    const [priceRange, setPriceRange] = useState<[number, number]>([
        priceMinParam ? parseInt(priceMinParam) : minPrice,
        priceMaxParam ? parseInt(priceMaxParam) : maxPrice,
    ]);

    // Sync slider with URL
    useEffect(() => {
        setPriceRange([
            priceMinParam ? parseInt(priceMinParam) : minPrice,
            priceMaxParam ? parseInt(priceMaxParam) : maxPrice,
        ]);
    }, [priceMinParam, priceMaxParam, minPrice, maxPrice]);

    const handleFilterChange = useCallback((type: 'brands' | 'families' | 'genders', value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        const filterSet = new Set(current.getAll(type));

        if (filterSet.has(value)) {
            filterSet.delete(value);
        } else {
            filterSet.add(value);
        }

        current.delete(type);
        filterSet.forEach(v => current.append(type, v));
        router.push(`${pathname}?${current.toString()}`);
    }, [searchParams, pathname, router]);

    const handlePriceCommit = useCallback((values: number[]) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('priceMin', String(values[0]));
        current.set('priceMax', String(values[1]));
        router.push(`${pathname}?${current.toString()}`);
    }, [searchParams, pathname, router]);

    const handleClearAll = useCallback(() => {
        router.push(pathname);
    }, [pathname, router]);

    const hasActiveFilters =
        activeBrands.size > 0 ||
        activeFamilies.size > 0 ||
        activeGenders.size > 0 ||
        priceMinParam !== null ||
        priceMaxParam !== null;

    return (
        <div className="space-y-4">
            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground w-full justify-start -ml-1 hover:text-destructive"
                    onClick={handleClearAll}
                >
                    <X className="h-3 w-3 mr-1" /> Effacer tous les filtres
                </Button>
            )}

            <Accordion type="multiple" defaultValue={['price', 'brands', 'families', 'genders']} className="w-full">

                {/* ─── Filtre Prix ─── */}
                <AccordionItem value="price">
                    <AccordionTrigger className="text-base font-semibold">Prix (€)</AccordionTrigger>
                    <AccordionContent>
                        <div className="pt-2 pb-1 px-1 space-y-4">
                            <Slider
                                min={minPrice}
                                max={maxPrice}
                                step={5}
                                value={priceRange}
                                onValueChange={(v) => setPriceRange(v as [number, number])}
                                onValueCommit={handlePriceCommit}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{priceRange[0]} €</span>
                                <span>{priceRange[1]} €</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ─── Marques ─── */}
                {brands.length > 0 && (
                <AccordionItem value="brands">
                    <AccordionTrigger className="text-base font-semibold">Marques</AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-48">
                            <div className="space-y-2 pr-4">
                                {brands.map(brand => (
                                    <div key={brand.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`brand-${brand.id}`}
                                            checked={activeBrands.has(brand.name)}
                                            onCheckedChange={() => handleFilterChange('brands', brand.name)}
                                        />
                                        <Label htmlFor={`brand-${brand.id}`} className="font-normal cursor-pointer">{brand.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
                )}

                {/* ─── Familles Olfactives ─── */}
                <AccordionItem value="families">
                    <AccordionTrigger className="text-base font-semibold">Familles Olfactives</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {families.map(family => (
                                <div key={family.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`family-${family.id}`}
                                        checked={activeFamilies.has(family.name)}
                                        onCheckedChange={() => handleFilterChange('families', family.name)}
                                    />
                                    <Label htmlFor={`family-${family.id}`} className="font-normal cursor-pointer">{family.name}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ─── Genre ─── */}
                <AccordionItem value="genders">
                    <AccordionTrigger className="text-base font-semibold">Genre</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {genders.map(gender => (
                                <div key={gender.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`gender-${gender.id}`}
                                        checked={activeGenders.has(gender.name)}
                                        onCheckedChange={() => handleFilterChange('genders', gender.name)}
                                    />
                                    <Label htmlFor={`gender-${gender.id}`} className="font-normal cursor-pointer">{gender.displayName}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
}
