'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import type { Product } from '@/lib/types';
import { searchProducts } from '@/app/actions';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      const performSearch = async () => {
        setIsLoading(true);
        const searchResults = await searchProducts(debouncedQuery);
        setResults(searchResults);
        setIsLoading(false);
        setShowResults(true);
      };
      performSearch();
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Rechercher un parfum, une marque..."
          className="pl-9 pr-10 h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-[60vh] overflow-y-auto">
          <div className="p-2">
            {results.map(product => (
              <Link
                key={product.id}
                href={`/parfum/${product.slug}`}
                onClick={handleResultClick}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
              >
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={product.images[0] || 'https://picsum.photos/seed/placeholder/48/48'}
                    alt={product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.brand.name}</p>
                </div>
                <p className="font-semibold text-primary text-sm whitespace-nowrap">{product.price.toFixed(2)} €</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showResults && debouncedQuery.length > 2 && !isLoading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 p-4">
          <p className="text-center text-muted-foreground text-sm">Aucun résultat trouvé pour "{debouncedQuery}"</p>
        </div>
      )}
    </div>
  );
}
