'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { computeShippingCost, FREE_SHIPPING_MIN_ITEMS } from '@/lib/data';
import { Check, X, ChevronLeft, ChevronRight, Truck, ShieldCheck } from 'lucide-react';

export function PrestashopLayerCart() {
  const {
    cart,
    lastAddedItem,
    isLayerCartOpen,
    closeLayerCart,
    getCartCount,
    getCartSubtotal,
  } = useCart();

  if (!isLayerCartOpen || !lastAddedItem) return null;

  const totalItems = getCartCount();
  const subtotal = getCartSubtotal();
  const shippingCost = computeShippingCost('colissimo', 'FR', totalItems, subtotal);
  const totalTtc = subtotal + shippingCost;
  const remainingForFree = Math.max(0, FREE_SHIPPING_MIN_ITEMS - totalItems);

  return (
    <div
      id="layer_cart_overlay"
      className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={closeLayerCart}
    >
      <div
        id="layer_cart"
        role="dialog"
        aria-modal="true"
        aria-label="Produit ajouté au panier"
        className="relative w-full max-w-3xl bg-white text-[#111827] rounded border-2 border-[#111827] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer (croix PrestaShop) */}
        <button
          type="button"
          onClick={closeLayerCart}
          className="absolute top-3 right-3 h-7 w-7 rounded-full bg-gray-200 hover:bg-[#111827] hover:text-white flex items-center justify-center transition-colors z-10"
          title="Fermer la fenêtre"
          aria-label="Fermer la fenêtre"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#e4dac9]">
          {/* COLONNE GAUCHE : Produit ajouté (.layer_cart_product) */}
          <div className="p-5 sm:p-6 bg-white">
            <div className="flex items-center gap-2 text-[#46a74e] font-bold text-sm sm:text-base border-b border-gray-200 pb-3 mb-4 pr-6">
              <span className="h-6 w-6 rounded-full bg-[#46a74e] text-white flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 stroke-[3]" />
              </span>
              <span>Produit ajouté au panier avec succès</span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded border border-[#e4dac9] bg-[#fdfaf4] shrink-0 overflow-hidden">
                <Image
                  src={lastAddedItem.image}
                  alt={lastAddedItem.name}
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              </div>
              <div className="space-y-1.5 text-xs sm:text-sm min-w-0">
                <p id="layer_cart_product_title" className="font-bold text-sm sm:text-base text-[#111827] leading-snug">
                  {lastAddedItem.name}
                </p>
                <p className="text-xs text-gray-500">Eau de Parfum Authentique — Dubaï</p>
                <div className="pt-1 space-y-0.5 text-xs">
                  <div>
                    <strong className="text-gray-700">Quantité ajoutée : </strong>
                    <span className="font-bold">{lastAddedItem.addedQty}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Total article : </strong>
                    <span className="font-extrabold text-[#d4a017] text-sm">
                      {(lastAddedItem.price * lastAddedItem.addedQty).toFixed(2)} € TTC
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jauge livraison gratuite */}
            <div className="mt-5 p-3 rounded bg-[#f7f0e6] border border-[#e4dac9] text-xs">
              {remainingForFree > 0 ? (
                <p className="text-[#111827] flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#d4a017] shrink-0" />
                  <span>
                    Ajoutez encore <strong className="text-[#d4a017]">{remainingForFree} parfum{remainingForFree > 1 ? 's' : ''}</strong> pour bénéficier de la <strong>Livraison 100% GRATUITE</strong> !
                  </span>
                </p>
              ) : (
                <p className="text-[#46a74e] font-bold flex items-center gap-2">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>🎉 Félicitations ! Votre livraison Colissimo 48h est OFFERTE !</span>
                </p>
              )}
            </div>
          </div>

          {/* COLONNE DROITE : État du panier (.layer_cart_cart) */}
          <div className="p-5 sm:p-6 bg-[#fdfaf4] flex flex-col justify-between">
            <div>
              <div className="font-bold text-sm sm:text-base text-[#111827] border-b border-[#e4dac9] pb-3 mb-4">
                Il y a <span className="text-[#d4a017] font-extrabold">{totalItems}</span>{' '}
                {totalItems > 1 ? 'produits' : 'produit'} dans votre panier.
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-dashed border-[#e4dac9]">
                  <strong className="text-gray-700">Total produits TTC</strong>
                  <span className="font-bold text-[#111827]">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#e4dac9]">
                  <strong className="text-gray-700">Frais de port (Colissimo 48h)</strong>
                  <span className="font-bold text-[#46a74e]">
                    {shippingCost === 0 ? 'Livraison gratuite !' : `${shippingCost.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-base font-extrabold text-[#111827] bg-[#f7f0e6] px-3 rounded border border-[#e4dac9]">
                  <span>Total TTC</span>
                  <span className="text-[#d4a017]">{totalTtc.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Boutons d'action PrestaShop */}
            <div className="mt-6 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={closeLayerCart}
                  className="w-full py-2.5 px-3 bg-white hover:bg-gray-100 text-[#111827] border border-[#111827] rounded-[2px] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Continuer mes achats</span>
                </button>
                <Link
                  href="/cart"
                  onClick={closeLayerCart}
                  className="w-full py-2.5 px-3 bg-[#d4a017] hover:bg-[#b88911] text-white rounded-[2px] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <span>Commander</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="text-[11px] text-center text-gray-500 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#46a74e]" />
                <span>Paiement 100% sécurisé par CB, Visa, Mastercard ou PayPal</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
