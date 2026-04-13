'use client';

/**
 * AuthCartBridge
 * Composant invisible qui relie l'authentification Firebase
 * au tracking des paniers abandonnés.
 *
 * Dès qu'un utilisateur est connecté, son email est transmis
 * au CartContext → active l'envoi automatique d'emails de relance.
 */
import { useEffect } from 'react';
import { useUser } from '@/firebase/provider';
import { useCart } from '@/context/cart-context';

export function AuthCartBridge() {
  const { user, isUserLoading } = useUser();
  const { setAbandonmentEmail } = useCart();

  useEffect(() => {
    if (!isUserLoading && user?.email) {
      setAbandonmentEmail(user.email);
    }
  }, [user, isUserLoading, setAbandonmentEmail]);

  return null; // composant invisible
}
