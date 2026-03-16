'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { trackAbandonedCart } from '@/app/actions';

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
    /** Appeler après login/signup pour activer le tracking panier abandonné */
    setAbandonmentEmail: (email: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'dubainegoce_cart';
const EMAIL_KEY = 'dubainegoce_user_email';
const ABANDON_DELAY_MS = 25 * 60 * 1000; // 25 minutes d'inactivité

const getInitialCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(CART_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const getStoredEmail = (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(EMAIL_KEY) || '';
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(getInitialCart);
    const [abandonmentEmail, setAbandonmentEmailState] = useState<string>(getStoredEmail);
    const abandonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Utiliser des refs pour éviter les stale closures dans les event listeners
    const cartRef = useRef(cart);
    const emailRef = useRef(abandonmentEmail);

    useEffect(() => { cartRef.current = cart; }, [cart]);
    useEffect(() => { emailRef.current = abandonmentEmail; }, [abandonmentEmail]);

    // ── Persister le panier dans localStorage ──────────────────────────────
    useEffect(() => {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent('cart-updated'));
        } catch {
            // ignore
        }
    }, [cart]);

    // ── Sync multi-onglets ─────────────────────────────────────────────────
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CART_KEY) setCart(getInitialCart());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // ── Sauvegarder panier abandonné ──────────────────────────────────────
    const saveAbandonedCart = useCallback(() => {
        const currentCart = cartRef.current;
        const email = emailRef.current;
        if (currentCart.length === 0 || !email) return;
        // Appel silencieux — ne pas bloquer l'UX si erreur
        trackAbandonedCart(currentCart, email).catch(() => {});
    }, []);

    // Timer : déclencher après 25 min d'inactivité si panier non vide
    useEffect(() => {
        if (abandonTimerRef.current) clearTimeout(abandonTimerRef.current);

        if (cart.length > 0 && abandonmentEmail) {
            abandonTimerRef.current = setTimeout(saveAbandonedCart, ABANDON_DELAY_MS);
        }

        return () => {
            if (abandonTimerRef.current) clearTimeout(abandonTimerRef.current);
        };
    }, [cart, abandonmentEmail, saveAbandonedCart]);

    // Page Visibility API : déclencher quand l'utilisateur quitte l'onglet
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                saveAbandonedCart();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [saveAbandonedCart]);

    // ── Exposer setAbandonmentEmail ────────────────────────────────────────
    const setAbandonmentEmail = useCallback((email: string) => {
        setAbandonmentEmailState(email);
        if (email) localStorage.setItem(EMAIL_KEY, email);
    }, []);

    // ── Actions panier ─────────────────────────────────────────────────────
    const addToCart = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        // GTM tracking
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            const qty = item.quantity || 1;
            (window as any).dataLayer.push({
                event: 'add_to_cart',
                ecommerce: {
                    value: item.price * qty,
                    currency: 'EUR',
                    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: qty }]
                }
            });
        }

        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i);
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }];
        });
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setCart(prev => prev.filter(i => i.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
        }
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const getCartCount = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartCount,
            setAbandonmentEmail,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
