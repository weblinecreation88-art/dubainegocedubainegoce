'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/types';

interface WishlistContextType {
    wishlist: string[];
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<string[]>([]);

    // Charger depuis le localStorage au démarrage
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist));
            } catch (e) {
                console.error('Failed to parse wishlist', e);
            }
        }
    }, []);

    // Sauvegarder dans le localStorage quand la liste change
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (productId: string) => {
        if (!wishlist.includes(productId)) {
            setWishlist((prev) => [...prev, productId]);
        }
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => prev.filter((id) => id !== productId));
    };

    const isInWishlist = (productId: string) => {
        return wishlist.includes(productId);
    };

    const toggleWishlist = (productId: string) => {
        if (wishlist.includes(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
