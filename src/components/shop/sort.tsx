'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface SortProps {
    onSortChange: (value: string) => void;
}

export function Sort({ onSortChange }: SortProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    const handleSortChange = (value: string) => {
        onSortChange(value);
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('sort', value);
        router.push(`${pathname}?${current.toString()}`);
    }

    return (
        <div className="flex items-center gap-2">
             <span className="text-sm text-muted-foreground hidden sm:inline">Trier par:</span>
             <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Nouveautés</SelectItem>
                    <SelectItem value="price-asc">Prix: Croissant</SelectItem>
                    <SelectItem value="price-desc">Prix: Décroissant</SelectItem>
                    <SelectItem value="name-asc">Nom: A-Z</SelectItem>
                    <SelectItem value="name-desc">Nom: Z-A</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
