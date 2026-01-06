'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCart = (): CartItem[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const savedCart = localStorage.getItem('dubainegoce_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        return [];
    }
};


export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(getInitialCart);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
             if (e.key === 'dubainegoce_cart') {
                setCart(getInitialCart());
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('dubainegoce_cart', JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent('cart-updated'));
        } catch (error) {
            console.error("Failed to save cart to localStorage", error);
        }
    }, [cart]);

    const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.id === item.id);
            if (existingItem) {
                return prevCart.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
                );
            }
            return [...prevCart, { ...item, quantity: item.quantity || 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCart([]);
    };
    
    const getCartCount = useCallback(() => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
