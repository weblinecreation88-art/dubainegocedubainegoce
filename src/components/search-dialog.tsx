
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import type { Product } from '@/lib/types';
import { searchProducts } from '@/app/actions';
import { getBrands, getFragranceFamilies } from '@/lib/data';

interface SearchDialogProps {
  children: React.ReactNode;
}

export function SearchDialog({ children }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const brands = getBrands().slice(0, 6);
  const families = getFragranceFamilies().slice(0, 6);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      const performSearch = async () => {
        setIsLoading(true);
        const searchResults = await searchProducts(debouncedQuery);
        setResults(searchResults);
        setIsLoading(false);
      };
      performSearch();
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Rechercher un parfum</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tapez un nom, une marque, une note..."
            className="pl-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {query.length === 0 ? (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Marques Populaires</h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <Link
                      key={brand.id}
                      href={`/shop?brands=${brand.name}`}
                      onClick={() => setOpen(false)}
                      className="px-3 py-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Familles Olfactives</h3>
                <div className="flex flex-wrap gap-2">
                  {families.map(family => (
                    <Link
                      key={family.id}
                      href={`/shop?families=${family.name}`}
                      onClick={() => setOpen(false)}
                      className="px-3 py-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                    >
                      {family.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map(product => (
                <Link key={product.id} href={`/parfum/${product.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent group transition-all">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image src={product.images[0] || 'https://picsum.photos/seed/placeholder/64/64'} alt={product.name} fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.brand.name}</p>
                  </div>
                  <p className="font-semibold text-primary">{product.price.toFixed(2)} €</p>
                </Link>
              ))}
            </div>
          ) : (
            debouncedQuery.length > 2 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">Aucun résultat trouvé pour "{debouncedQuery}"</p>
                <p className="text-sm text-muted-foreground">Essayez d'autres mots-clés ou parcourez nos catégories.</p>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
