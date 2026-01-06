
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

interface SearchDialogProps {
    children: React.ReactNode;
}

export function SearchDialog({ children }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

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
    if(!open) {
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
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {results.length > 0 ? (
                <div className="space-y-2">
                    {results.map(product => (
                        <Link key={product.id} href={`/parfum/${product.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent">
                             <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                <Image src={product.images[0] || 'https://picsum.photos/seed/placeholder/64/64'} alt={product.name} fill sizes="64px" className="object-cover" />
                             </div>
                             <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.brand.name}</p>
                             </div>
                             <p className="ml-auto font-semibold text-primary">{product.price.toFixed(2)} €</p>
                        </Link>
                    ))}
                </div>
            ) : (
                debouncedQuery.length > 2 && !isLoading && (
                    <p className="text-center text-muted-foreground py-8">Aucun résultat trouvé pour "{debouncedQuery}"</p>
                )
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
