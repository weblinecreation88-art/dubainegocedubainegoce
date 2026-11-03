'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { computeShippingCost, FREE_SHIPPING_MIN_ITEMS } from '@/lib/data';

const formatPrice = (value: number) => `${value.toFixed(2).replace('.', ',')} €`;

/** Tiroir panier qui glisse depuis la droite (ouvert après un ajout ou via l'icône panier). */
export function CartDrawer() {
  const {
    cart,
    lastAddedItem,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    getCartCount,
    getCartSubtotal,
  } = useCart();

  const totalItems = getCartCount();
  const subtotal = getCartSubtotal();
  const shippingCost = computeShippingCost('colissimo', 'FR', totalItems, subtotal);
  const total = subtotal + shippingCost;
  const remainingForFree = Math.max(0, FREE_SHIPPING_MIN_ITEMS - totalItems);
  const freeShippingProgress = Math.min(100, (totalItems / FREE_SHIPPING_MIN_ITEMS) * 100);

  return (
    <DialogPrimitive.Root open={isCartDrawerOpen} onOpenChange={(open) => !open && closeCartDrawer()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[10000] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 right-0 z-[10001] flex h-full w-full sm:max-w-md flex-col bg-white text-[#1d1a16] shadow-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right focus:outline-none"
        >
          {/* En-tête */}
          <div className="flex items-center justify-between border-b border-[#e6ded1] px-5 py-4">
            <DialogPrimitive.Title className="font-headline text-xl">
              Votre panier{totalItems > 0 && <span className="text-[#6f6559] text-base"> ({totalItems})</span>}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-[#f3ede3] transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="sr-only">
            Récapitulatif des articles de votre panier
          </DialogPrimitive.Description>

          {cart.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingBag className="h-10 w-10 text-[#b8955f]" strokeWidth={1.2} />
              <p className="text-sm text-[#6f6559]">Votre panier est vide.</p>
              <DialogPrimitive.Close asChild>
                <Link
                  href="/shop/all"
                  className="py-3 px-6 bg-[#1d1a16] hover:bg-[#3a342c] text-white text-xs uppercase tracking-[0.14em] transition-colors"
                >
                  Découvrir nos parfums
                </Link>
              </DialogPrimitive.Close>
            </div>
          ) : (
            <>
              {/* Jauge livraison offerte */}
              <div className="px-5 py-3 bg-[#faf7f2] border-b border-[#e6ded1] text-xs">
                <p className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#a8834f] shrink-0" strokeWidth={1.5} />
                  {remainingForFree > 0 ? (
                    <span>
                      Plus que <strong>{remainingForFree} parfum{remainingForFree > 1 ? 's' : ''}</strong> pour la livraison offerte
                    </span>
                  ) : (
                    <span className="font-medium text-[#3d7a44]">Livraison Colissimo offerte !</span>
                  )}
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-[#e6ded1] overflow-hidden">
                  <div
                    className="h-full bg-[#b8955f] transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Articles */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#e6ded1] px-5">
                {cart.map((item) => {
                  const justAdded = lastAddedItem?.id === item.id;
                  return (
                    <div key={item.id} className="flex gap-4 py-4">
                      <div className="relative h-24 w-20 bg-[#f3ede3] shrink-0 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <DialogPrimitive.Close asChild>
                            <Link href={`/parfum/${item.slug}`} className="text-sm leading-snug hover:text-[#a8834f]">
                              {item.name}
                            </Link>
                          </DialogPrimitive.Close>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#6f6559] hover:text-red-700 p-1 -mr-1 shrink-0"
                            aria-label={`Retirer ${item.name} du panier`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        {justAdded && (
                          <span className="mt-1 text-[11px] font-medium text-[#3d7a44]">✓ Ajouté au panier</span>
                        )}
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <div className="flex items-center border border-[#e6ded1]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-[#f3ede3]"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-[#f3ede3]"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totaux et actions */}
              <div className="border-t border-[#e6ded1] bg-[#faf7f2] px-5 py-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#5d564c]">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#5d564c]">
                  <span>Livraison (Colissimo 48h)</span>
                  <span>{shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-[#e6ded1]">
                  <span>Total TTC</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <DialogPrimitive.Close asChild>
                  <Link
                    href="/cart"
                    className="mt-3 block text-center py-3.5 bg-[#b8955f] hover:bg-[#a8834f] text-[#1d1a16] text-xs font-medium uppercase tracking-[0.14em] transition-colors"
                  >
                    Commander
                  </Link>
                </DialogPrimitive.Close>
                <DialogPrimitive.Close className="w-full py-2.5 border border-[#1d1a16] hover:bg-white text-[11px] uppercase tracking-[0.12em] transition-colors">
                  Continuer mes achats
                </DialogPrimitive.Close>
                <p className="pt-1 text-[11px] text-center text-[#6f6559] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#3d7a44]" />
                  Paiement 100% sécurisé
                </p>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
