'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Brand, FragranceFamily, GenderCategory } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface FiltersProps {
    brands: Brand[];
    families: FragranceFamily[];
    genders: GenderCategory[];
}

export function Filters({ brands, families, genders }: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeBrands = new Set(searchParams.getAll('brands'));
    const activeFamilies = new Set(searchParams.getAll('families'));
    const activeGenders = new Set(searchParams.getAll('genders'));

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

        const query = current.toString();
        router.push(`${pathname}?${query}`);

    }, [searchParams, pathname, router]);

    return (
        <div className="space-y-6">
            <Accordion type="multiple" defaultValue={['brands', 'families', 'genders']} className="w-full">
                <AccordionItem value="brands">
                    <AccordionTrigger className="text-lg font-semibold">Marques</AccordionTrigger>
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

                <AccordionItem value="families">
                    <AccordionTrigger className="text-lg font-semibold">Familles Olfactives</AccordionTrigger>
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

                <AccordionItem value="genders">
                    <AccordionTrigger className="text-lg font-semibold">Genre</AccordionTrigger>
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
