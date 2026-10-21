'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { X, Star, Minus, Plus, ShoppingCart, Check, Truck, ShieldCheck } from 'lucide-react';

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const reference = `DN-${product.brand.name.substring(0, 3).toUpperCase()}-${product.id.padStart(3, '0')}`;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      image: product.images[0] || '/og-image.png',
      quantity: qty,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={closeQuickView}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Aperçu rapide : ${product.name}`}
        className="relative w-full max-w-3xl bg-white text-[#111827] rounded border-2 border-[#111827] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-100 hover:bg-[#111827] hover:text-white flex items-center justify-center transition-colors z-10"
          aria-label="Fermer l'aperçu rapide"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-6">
          {/* Image */}
          <div className="relative aspect-square rounded border border-[#e4dac9] bg-[#fdfaf4] overflow-hidden">
            <Image
              src={product.images[0] || '/og-image.png'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 90vw, 400px"
              className="object-contain p-6"
            />
            <span className="absolute top-2.5 left-2.5 bg-[#111827] text-[#d4a017] text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px]">
              {product.brand.name}
            </span>
          </div>

          {/* Détails PrestaShop */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#111827] leading-tight">
                {product.name}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <span>
                  <strong>Référence :</strong> <span className="text-[#111827] font-semibold">{reference}</span>
                </span>
                <span>•</span>
                <span>
                  <strong>État :</strong> <span className="text-[#111827] font-semibold">Nouveau produit</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[#d4a017]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
                <span className="text-xs text-gray-600 ml-1">({product.rating.toFixed(1)}/5)</span>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 border-y border-[#e4dac9] py-2.5">
                {product.shortDescription || `Eau de Parfum authentique ${product.volumeMl}ml de la maison ${product.brand.name}, importée de Dubaï.`}
              </p>

              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <span className="ps-badge-instock flex items-center gap-1">
                    <Check className="h-3 w-3 stroke-[3]" /> En stock
                  </span>
                ) : (
                  <span className="bg-red-700 text-white text-xs font-bold px-2 py-0.5 rounded-[2px]">
                    Rupture de stock
                  </span>
                )}
                <span className="text-xs text-gray-500">Expédition sous 24h depuis la France</span>
              </div>
            </div>

            {/* Prix & Ajout au panier */}
            <div className="bg-[#f7f0e6] p-4 rounded border border-[#e4dac9] space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                    {product.price.toFixed(2)} €
                  </span>
                  <span className="text-xs text-gray-600 ml-1.5">TTC</span>
                </div>
                <span className="text-[11px] font-bold text-[#46a74e]">
                  Flacon {product.volumeMl} ml
                </span>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white border border-[#e4dac9] rounded-[2px]">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-9 w-8 flex items-center justify-center hover:bg-gray-100"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="h-9 w-8 flex items-center justify-center hover:bg-gray-100"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="flex-1 h-9 bg-[#d4a017] hover:bg-[#b88911] text-white font-bold text-xs uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 shadow transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Ajouter au panier</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#e4dac9] text-[11px] text-gray-600">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-[#d4a017]" /> Gratuit dès 3 parfums
                </span>
                <Link
                  href={`/parfum/${product.slug}`}
                  onClick={closeQuickView}
                  className="font-bold text-[#111827] hover:text-[#d4a017] underline"
                >
                  Voir la fiche complète →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
