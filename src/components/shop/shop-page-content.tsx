'use client';

import { useState, useMemo, useEffect } from 'react';
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
  fragranceFamilies: FragranceFamily[];
  genders: GenderCategory[];
}

export function ShopPageContent({ products, brands, fragranceFamilies, genders }: ShopPageContentProps) {
  const searchParams = useSearchParams();
  const [sort, setSort] = useState('default');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (searchParams) {
      setSort(searchParams.get('sort') || 'default');
      setSelectedBrands(searchParams.getAll('brands'));
      setSelectedFamilies(searchParams.getAll('families'));
      setSelectedGenders(searchParams.getAll('genders'));
    }
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand.name));
    }

    if (selectedFamilies.length > 0) {
      filtered = filtered.filter(p => selectedFamilies.includes(p.family));
    }
    
    if (selectedGenders.length > 0) {
        filtered = filtered.filter(p => selectedGenders.includes(p.gender));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filtered;
    }
  }, [products, sort, selectedBrands, selectedFamilies, selectedGenders, priceRange]);
  
  const handleFilterChange = (type: 'brands' | 'families' | 'genders' | 'price', value: any) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    
    if (type === 'brands') {
        setSelectedBrands(value);
        params.delete('brands');
        value.forEach((brand: string) => params.append('brands', brand));
    }
    if (type === 'families') {
        setSelectedFamilies(value);
        params.delete('families');
        value.forEach((family: string) => params.append('families', family));
    }
    if (type === 'genders') {
        setSelectedGenders(value);
        params.delete('genders');
        value.forEach((gender: string) => params.append('genders', gender));
    }
    if (type === 'price') {
      setPriceRange(value);
      params.set('price_min', value[0]);
      params.set('price_max', value[1]);
    }

    window.history.pushState(null, '', `?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('sort', value);
    window.history.pushState(null, '', `?${params.toString()}`);
  }

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedFamilies([]);
    setSelectedGenders([]);
    setPriceRange([0, 500]);
    setSort('default');
    window.history.pushState(null, '', window.location.pathname);
  }

  const filtersComponent = (
    <div className="space-y-6">
        <Filters 
            brands={brands}
            families={fragranceFamilies}
            genders={genders}
        />
        <Button onClick={clearFilters} variant="outline" className="w-full">
            Réinitialiser les filtres
        </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block">
            <h2 className="text-lg font-semibold mb-4">Filtres</h2>
            {filtersComponent}
        </aside>

        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <div className='lg:hidden'>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Filtres
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>Filtres</SheetTitle>
                            <SheetDescription>
                                Affinez votre recherche pour trouver le parfum parfait.
                            </SheetDescription>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100%-150px)]">
                            <div className="p-4">
                                {filtersComponent}
                            </div>
                        </ScrollArea>
                        <SheetFooter className='p-4'>
                            <Button onClick={() => setIsSheetOpen(false)} className='w-full'>Voir les {filteredAndSortedProducts.length} produits</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
            <p className="text-sm text-gray-500 hidden sm:block">
              {filteredAndSortedProducts.length} produits trouvés
            </p>
            <Sort onSortChange={handleSortChange} />
          </div>

          <ProductGrid products={filteredAndSortedProducts} />
        </main>
      </div>
    </div>
  );
}