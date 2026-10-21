'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ShoppingCart, User, Heart, ChevronDown, Trash2, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ScrollArea } from '../ui/scroll-area';
import { isAdminEmail } from '@/lib/admin-emails';
import { useDebounce } from '@/hooks/use-debounce';
import { searchProducts } from '@/app/actions';
import type { Product } from '@/lib/types';
import { computeShippingCost } from '@/lib/data';

const BRAND_LINKS = [
  { name: 'Lattafa', href: '/shop/all?brands=Lattafa', desc: 'Khamrah, Yara, Asad, Fakhar...' },
  { name: 'Maison Alhambra', href: '/shop/all?brands=Maison+Alhambra', desc: 'Tobacco Touch, Woody Oud, Grise...' },
  { name: 'French Avenue', href: '/shop/all?brands=French+Avenue', desc: 'Liquid Brun, Spectre, Azzure...' },
  { name: 'Fragrance World', href: '/shop/all?brands=Fragrance+World', desc: 'Barakkat, Cocktail Intense...' },
  { name: 'Paris Corner', href: '/shop/all?brands=Paris+Corner', desc: 'Emir, Pendora Scents, Khair...' },
  { name: 'Ard Al Zaafaran', href: '/shop/all?brands=Ard+Al+Zaafaran', desc: 'Oud 24 Hours, Dirham, Mousuf...' },
  { name: 'Asdaaf', href: '/shop/all?brands=Asdaaf', desc: 'Ameerat Al Arab, Andaleeb...' },
  { name: 'Armaf', href: '/shop/all?brands=Armaf', desc: 'Club de Nuit, Tag Him...' },
];

const FAMILY_LINKS = [
  { name: 'Boisé & Oud', href: '/shop/all?families=Boisé', desc: 'Sillages nobles, oud royal, santal et cèdre' },
  { name: 'Oriental & Ambré', href: '/shop/all?families=Oriental', desc: 'Notes chaudes d’ambre, épices et résines' },
  { name: 'Gourmand & Vanille', href: '/shop/all?families=Gourmand', desc: 'Vanille, praline, caramel, datte et cannelle' },
  { name: 'Floral & Poudré', href: '/shop/all?families=Floral', desc: 'Rose de Damas, jasmin, fleur d’oranger' },
  { name: 'Frais & Agrumes', href: '/shop/all?families=Frais', desc: 'Bergamote, néroli, notes marines et hespéridées' },
  { name: 'Musc Blanc & Doux', href: '/shop/all?families=Musc', desc: 'Muscs purs, coton frais et sillage seconde peau' },
];

export default function Header() {
  const { cart, getCartCount, getCartSubtotal, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const { wishlist } = useWishlist();
  const auth = useAuth();
  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Recherche PrestaShop directe dans le header
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 250);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      let active = true;
      setIsSearching(true);
      searchProducts(debouncedSearch.trim()).then((res) => {
        if (active) {
          setSearchResults(res.slice(0, 6));
          setIsSearching(false);
          setShowSearchDropdown(true);
        }
      });
      return () => { active = false; };
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    if (searchQuery.trim()) {
      router.push(`/shop/all?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop/all');
    }
  };

  const cartCount = isMounted ? getCartCount() : 0;
  const cartSubtotal = isMounted ? getCartSubtotal() : 0;
  const shippingCost = isMounted ? computeShippingCost('colissimo', 'FR', cartCount, cartSubtotal) : 0;
  const cartTotal = cartSubtotal + shippingCost;

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      clearCart();
    }
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header id="header" className="w-full bg-white text-[#111827] shadow-sm">
      {/* LIGNE PRINCIPALE PRESTASHOP (ndkcp-1) */}
      <div id="ndkcp-1" className="border-b border-[#e4dac9] bg-white">
        <div className="container mx-auto px-3 sm:px-4 py-2.5 lg:py-3.5">
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 lg:gap-5">

            {/* 1. MENU MOBILE + LOGO + BADGE FRANCE */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Mobile Menu Trigger */}
              <div className="lg:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 border-[#e4dac9] text-[#111827]" aria-label="Ouvrir le menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[310px] sm:w-[360px] p-0 flex flex-col bg-white text-[#111827]">
                    <SheetHeader className="p-4 bg-[#111827] text-white border-b border-[#d4a017]">
                      <SheetTitle className="text-left font-headline text-lg text-[#d4a017] uppercase tracking-wider">
                        Dubaï Négoce
                      </SheetTitle>
                      <SheetDescription className="text-left text-xs text-white/75">
                        Parfums Authentiques de Dubaï • Prix unique 35,00 € TTC
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="flex-1">
                      <div className="flex flex-col p-4 space-y-2 text-sm">
                        <Link href="/shop/all" onClick={handleLinkClick} className="font-bold py-2 border-b border-gray-100 text-[#111827] hover:text-[#d4a017]">
                          🛍️ Tous les Parfums (35,00 €)
                        </Link>
                        <Link href="/shop/all?sort=bestsellers" onClick={handleLinkClick} className="font-bold py-2 border-b border-gray-100 text-[#d4a017]">
                          ⭐ Meilleures Ventes &amp; Viraux
                        </Link>
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="genres">
                            <AccordionTrigger className="py-2.5 font-bold">Parfums par Genre</AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col gap-2.5 pl-3 pt-1">
                                <Link href="/shop/all?genders=femme" onClick={handleLinkClick}>Parfums Femme</Link>
                                <Link href="/shop/all?genders=homme" onClick={handleLinkClick}>Parfums Homme</Link>
                                <Link href="/shop/all?genders=mixte" onClick={handleLinkClick}>Parfums Mixtes / Unisexes</Link>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="marques">
                            <AccordionTrigger className="py-2.5 font-bold">Maisons de Dubaï</AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col gap-2.5 pl-3 pt-1">
                                {BRAND_LINKS.map((b) => (
                                  <Link key={b.name} href={b.href} onClick={handleLinkClick}>
                                    {b.name}
                                  </Link>
                                ))}
                                <Link href="/shop/all" onClick={handleLinkClick} className="font-bold text-[#d4a017]">
                                  → Voir toutes les marques
                                </Link>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="familles">
                            <AccordionTrigger className="py-2.5 font-bold">Familles Olfactives</AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col gap-2.5 pl-3 pt-1">
                                {FAMILY_LINKS.map((f) => (
                                  <Link key={f.name} href={f.href} onClick={handleLinkClick}>
                                    {f.name}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <Link href="/trouver-mon-parfum" onClick={handleLinkClick} className="font-bold py-2 border-b border-gray-100">
                          ✨ Diagnostic Parfum (Quiz)
                        </Link>
                        <Link href="/blog" onClick={handleLinkClick} className="font-bold py-2 border-b border-gray-100">
                          📖 Le Blog Parfumerie
                        </Link>
                        <Link href="/suivi-commande" onClick={handleLinkClick} className="font-bold py-2 border-b border-gray-100">
                          📦 Suivre ma commande
                        </Link>
                        <Link href="/faq" onClick={handleLinkClick} className="font-bold py-2 border-b border-gray-100">
                          ❓ Foire Aux Questions (FAQ)
                        </Link>
                        <Link href="/contact" onClick={handleLinkClick} className="font-bold py-2 border-b border-gray-100">
                          ✉️ Contacter le Service Client
                        </Link>
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Logo PrestaShop */}
              <Link href="/" className="flex flex-col leading-none group" aria-label="Accueil Dubaï Négoce">
                <span className="font-headline font-extrabold text-xl sm:text-2xl lg:text-[26px] tracking-wider uppercase text-[#111827] group-hover:text-[#d4a017] transition-colors">
                  DUBAÏ<span className="text-[#d4a017]">NÉGOCE</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mt-0.5">
                  Parfums Authentiques de Dubaï
                </span>
              </Link>

              {/* Repère tarifaire clair et vérifiable */}
              <div className="hidden xl:flex items-center gap-2.5 bg-[#fdfaf4] border border-[#e4dac9] rounded px-3 py-1.5 ml-1">
                <span className="text-xs font-extrabold text-white bg-[#111827] px-2 py-0.5 rounded-[2px]">
                  35 €
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-bold text-[#111827]">Prix unique TTC</p>
                  <p className="text-[10px] text-gray-600">Port offert dès 3 parfums</p>
                </div>
              </div>
            </div>

            {/* 2. BARRE DE RECHERCHE CENTRALE PRESTASHOP (#search_block_top) */}
            <div
              id="search_block_top"
              ref={searchContainerRef}
              className="order-3 lg:order-2 w-full lg:flex-1 lg:max-w-xl relative"
            >
              <form id="searchbox" onSubmit={handleSearchSubmit} className="flex w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="search_query"
                    value={searchQuery}
                    onFocus={() => {
                      if (searchQuery.trim().length >= 2) setShowSearchDropdown(true);
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un parfum, une marque (ex: Khamrah, Yara, Lattafa, Oud)..."
                    className="w-full h-10 px-3.5 text-sm bg-[#fdfaf4] border border-[#d4a017] rounded-l focus:outline-none focus:ring-1 focus:ring-[#d4a017] text-[#111827] placeholder:text-gray-400"
                  />
                  {isSearching && (
                    <Loader2 className="h-4 w-4 animate-spin text-[#d4a017] absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 sm:px-5 bg-[#d4a017] hover:bg-[#b88911] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-r flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Rechercher</span>
                </button>
              </form>

              {/* Résultats d'autocomplétion PrestaShop */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e4dac9] shadow-xl rounded z-50 overflow-hidden">
                  <div className="bg-[#f7f0e6] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-700 border-b border-[#e4dac9]">
                    Parfums trouvés ({searchResults.length})
                  </div>
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        href={`/parfum/${p.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#fdfaf4] transition-colors"
                      >
                        <div className="relative h-12 w-12 rounded border border-gray-200 bg-white shrink-0 overflow-hidden">
                          <Image
                            src={p.images[0] || '/og-image.png'}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#111827] truncate">{p.name}</p>
                          <p className="text-[11px] text-gray-500">{p.brand.name} • Eau de Parfum {p.volumeMl}ml</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-extrabold text-[#d4a017] block">{p.price.toFixed(2)} €</span>
                          <span className="text-[10px] text-[#46a74e] font-bold">En stock</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/shop/all?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block text-center py-2 bg-[#111827] text-[#d4a017] hover:bg-black text-xs font-bold uppercase tracking-wider"
                  >
                    Voir tous les résultats pour &laquo; {searchQuery} &raquo; →
                  </Link>
                </div>
              )}
            </div>

            {/* 3. COMPTE + FAVORIS + BLOC PANIER PRESTASHOP (.shopping_cart) */}
            <div className="order-2 lg:order-3 flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mon Compte PrestaShop */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-transparent hover:border-[#e4dac9] hover:bg-[#fdfaf4] transition-colors text-left"
                      aria-label="Mon compte client"
                    >
                      <User className="h-5 w-5 text-[#d4a017]" />
                      <div className="hidden sm:block leading-tight">
                        <span className="block text-[10px] text-gray-500">Bienvenue</span>
                        <span className="block text-xs font-bold text-[#111827] max-w-[90px] truncate">
                          {user.displayName || 'Mon Compte'}
                        </span>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-white text-[#111827] border-[#e4dac9]">
                    <DropdownMenuLabel>Mon Espace Client</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/account">Mon Profil</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/account/orders">Historique de commandes</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/suivi-commande">Suivre un colis</Link></DropdownMenuItem>
                    {isAdminEmail(user?.email) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/admin">📊 Administration</Link></DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">Déconnexion</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-transparent hover:border-[#e4dac9] hover:bg-[#fdfaf4] transition-colors"
                  title="Voir mon compte client"
                >
                  <User className="h-5 w-5 text-[#111827]" />
                  <div className="hidden sm:block leading-tight">
                    <span className="block text-[10px] text-gray-500">Espace client</span>
                    <span className="block text-xs font-bold text-[#111827]">Mon Compte</span>
                  </div>
                </Link>
              )}

              {/* Favoris */}
              <Link
                href="/wishlist"
                className="relative flex items-center justify-center h-9 w-9 rounded border border-[#e4dac9] bg-[#fdfaf4] hover:border-[#d4a017] transition-colors"
                title="Mes Parfums Favoris"
                aria-label="Mes Favoris"
              >
                <Heart className="h-4 w-4 text-[#111827]" />
                {isMounted && wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-[#d4a017] text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Bloc Panier PrestaShop (.blockcart-top / .shopping_cart) avec Dropdown au survol */}
              <div className="relative group/cart">
                <Link
                  href="/cart"
                  className="flex items-center gap-2.5 bg-[#111827] hover:bg-black text-white px-3 sm:px-4 py-2 rounded border border-[#d4a017] transition-colors"
                  title="Voir mon panier"
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5 text-[#d4a017]" />
                    <span className="sm:hidden absolute -top-2 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-[#d4a017] text-[#111827] text-[10px] font-extrabold flex items-center justify-center">
                      {cartCount}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs">
                    <b className="font-bold uppercase tracking-wide text-[#d4a017]">Panier</b>
                    {cartCount > 0 ? (
                      <>
                        <span className="bg-[#d4a017] text-[#111827] font-extrabold px-1.5 py-0.5 rounded-[2px] text-[11px]">
                          {cartCount}
                        </span>
                        <span className="text-white/90">
                          {cartCount === 1 ? 'Produit' : 'Produits'}
                        </span>
                        <span className="text-white/40">—</span>
                        <span className="font-extrabold text-white">{cartSubtotal.toFixed(2)} €</span>
                      </>
                    ) : (
                      <span className="text-white/75">(vide)</span>
                    )}
                  </div>
                </Link>

                {/* Dropdown PrestaShop .cart_block au survol desktop */}
                <div className="hidden lg:group-hover/cart:block absolute right-0 top-full pt-1.5 w-80 z-50">
                  <div className="bg-white border-2 border-[#111827] rounded shadow-2xl overflow-hidden text-[#111827]">
                    <div className="bg-[#111827] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex justify-between items-center border-b border-[#d4a017]">
                      <span>Mon Panier ({cartCount})</span>
                      {cartCount >= 3 ? (
                        <span className="text-[#46a74e] text-[11px]">✔ Livraison Gratuite !</span>
                      ) : (
                        <span className="text-[#d4a017] text-[11px]">Gratuit dès 3 parfums</span>
                      )}
                    </div>

                    {cart.length === 0 ? (
                      <p className="p-6 text-center text-xs text-gray-500">Aucun produit dans votre panier.</p>
                    ) : (
                      <>
                        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 p-3 space-y-2">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-2.5 pt-2 first:pt-0">
                              <div className="relative h-12 w-12 rounded border border-gray-200 bg-gray-50 shrink-0 overflow-hidden">
                                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link href={`/parfum/${item.slug}`} className="text-xs font-bold hover:text-[#d4a017] truncate block">
                                  {item.name}
                                </Link>
                                <span className="text-[11px] text-gray-500">
                                  Qté : <strong>{item.quantity}</strong> × {item.price.toFixed(2)} €
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeFromCart(item.id);
                                }}
                                className="text-gray-400 hover:text-red-600 p-1"
                                title="Retirer du panier"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#f7f0e6] p-3.5 border-t border-[#e4dac9] space-y-1.5 text-xs">
                          <div className="flex justify-between text-gray-700">
                            <span>Livraison</span>
                            <span className="font-bold text-[#46a74e]">
                              {shippingCost === 0 ? 'Livraison gratuite !' : `${shippingCost.toFixed(2)} €`}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-extrabold text-[#111827] pt-1 border-t border-[#e4dac9]">
                            <span>Total TTC</span>
                            <span className="text-[#d4a017]">{cartTotal.toFixed(2)} €</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <Link
                              href="/cart"
                              className="text-center py-2 px-2 bg-white border border-[#111827] text-[#111827] hover:bg-gray-100 font-bold text-xs uppercase rounded-[2px] transition-colors"
                            >
                              Voir panier
                            </Link>
                            <Link
                              href="/cart"
                              className="text-center py-2 px-2 bg-[#d4a017] hover:bg-[#b88911] text-white font-bold text-xs uppercase rounded-[2px] transition-colors"
                            >
                              Commander
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BARRE DE MÉGA-MENU PRESTASHOP HORIZONTALE (ndkcp-3) */}
      <nav id="ndkcp-3" aria-label="Navigation principale des catégories" className="hidden lg:block bg-[#111827] text-white border-b-2 border-[#d4a017]">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">

            {/* 1. TOUS LES PARFUMS */}
            <li>
              <Link
                href="/shop/all"
                className="flex items-center gap-1.5 py-3 px-3 hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <span>Tous nos Parfums</span>
              </Link>
            </li>

            {/* 2. PARFUMS FEMME (Dropdown) */}
            <li className="relative group">
              <Link
                href="/shop/all?genders=femme"
                className="flex items-center gap-1 py-3 px-3 hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <span>Parfums Femme</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-75" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full w-[480px] bg-white text-[#111827] shadow-2xl border-2 border-[#111827] border-t-4 border-t-[#d4a017] p-5 z-50 normal-case font-normal">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-[#d4a017] border-b border-[#e4dac9] pb-1.5 mb-2.5">
                      Sillages Femme
                    </p>
                    <ul className="space-y-2 text-xs font-medium">
                      <li><Link href="/shop/all?genders=femme&families=Gourmand" className="hover:text-[#d4a017] block">Gourmand, Vanille &amp; Fruits</Link></li>
                      <li><Link href="/shop/all?genders=femme&families=Floral" className="hover:text-[#d4a017] block">Floral, Rose &amp; Jasmin</Link></li>
                      <li><Link href="/shop/all?genders=femme&families=Oriental" className="hover:text-[#d4a017] block">Oriental &amp; Ambré Sensuel</Link></li>
                      <li><Link href="/shop/all?genders=femme&families=Musc" className="hover:text-[#d4a017] block">Musc Blanc &amp; Poudré</Link></li>
                      <li><Link href="/shop/all?genders=femme" className="font-bold text-[#111827] hover:text-[#d4a017] block pt-1">→ Tous les parfums Femme</Link></li>
                    </ul>
                  </div>
                  <div className="bg-[#f7f0e6] p-3 rounded border border-[#e4dac9]">
                    <p className="font-bold text-xs uppercase text-[#111827] mb-1">Incontournables Femme</p>
                    <p className="text-[11px] text-gray-600 mb-2">Yara Lattafa, Lovely Chérie, Pose As Rose, Good Girl Killer...</p>
                    <Link
                      href="/shop/all?genders=femme&sort=bestsellers"
                      className="inline-block bg-[#d4a017] text-white text-[11px] font-bold uppercase px-3 py-1.5 rounded-[2px] hover:bg-[#b88911]"
                    >
                      Voir les Top Ventes Femme
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            {/* 3. PARFUMS HOMME (Dropdown) */}
            <li className="relative group">
              <Link
                href="/shop/all?genders=homme"
                className="flex items-center gap-1 py-3 px-3 hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <span>Parfums Homme</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-75" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full w-[480px] bg-white text-[#111827] shadow-2xl border-2 border-[#111827] border-t-4 border-t-[#d4a017] p-5 z-50 normal-case font-normal">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-[#d4a017] border-b border-[#e4dac9] pb-1.5 mb-2.5">
                      Sillages Homme
                    </p>
                    <ul className="space-y-2 text-xs font-medium">
                      <li><Link href="/shop/all?genders=homme&families=Boisé" className="hover:text-[#d4a017] block">Boisé, Cèdre &amp; Oud Intense</Link></li>
                      <li><Link href="/shop/all?genders=homme&families=Oriental" className="hover:text-[#d4a017] block">Épicé, Cuir &amp; Tabac</Link></li>
                      <li><Link href="/shop/all?genders=homme&families=Frais" className="hover:text-[#d4a017] block">Frais, Aromatique &amp; Agrumes</Link></li>
                      <li><Link href="/shop/all?genders=homme" className="font-bold text-[#111827] hover:text-[#d4a017] block pt-1">→ Tous les parfums Homme</Link></li>
                    </ul>
                  </div>
                  <div className="bg-[#f7f0e6] p-3 rounded border border-[#e4dac9]">
                    <p className="font-bold text-xs uppercase text-[#111827] mb-1">Incontournables Homme</p>
                    <p className="text-[11px] text-gray-600 mb-2">Asad Lattafa, Liquid Brun, Woody Oud, Tobacco Touch...</p>
                    <Link
                      href="/shop/all?genders=homme&sort=bestsellers"
                      className="inline-block bg-[#d4a017] text-white text-[11px] font-bold uppercase px-3 py-1.5 rounded-[2px] hover:bg-[#b88911]"
                    >
                      Voir les Top Ventes Homme
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            {/* 4. PARFUMS MIXTES */}
            <li>
              <Link
                href="/shop/all?genders=mixte"
                className="flex items-center gap-1 py-3 px-3 hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <span>Parfums Mixtes</span>
              </Link>
            </li>

            {/* 5. MARQUES DE DUBAÏ (Méga-Menu) */}
            <li className="relative group">
              <Link
                href="/shop/all"
                className="flex items-center gap-1 py-3 px-3 hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <span>Marques de Dubaï</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-75" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full w-[640px] bg-white text-[#111827] shadow-2xl border-2 border-[#111827] border-t-4 border-t-[#d4a017] p-5 z-50 normal-case font-normal">
                <p className="font-bold text-xs uppercase tracking-wider text-[#d4a017] border-b border-[#e4dac9] pb-2 mb-3">
                  Les Plus Grandes Maisons de Parfumerie des Émirats (100% Authentiques)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {BRAND_LINKS.map((b) => (
                    <Link
                      key={b.name}
                      href={b.href}
                      className="p-2.5 rounded border border-gray-100 hover:border-[#d4a017] hover:bg-[#fdfaf4] transition-colors block"
                    >
                      <span className="font-bold text-xs text-[#111827] block">{b.name} ›</span>
                      <span className="text-[11px] text-gray-500">{b.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* 6. FAMILLES OLFACTIVES (Méga-Menu) */}
            <li className="relative group">
              <Link
                href="/shop/all"
                className="flex items-center gap-1 py-3 px-3 hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <span>Notes &amp; Familles</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-75" />
              </Link>
              <div className="hidden group-hover:block absolute right-0 top-full w-[560px] bg-white text-[#111827] shadow-2xl border-2 border-[#111827] border-t-4 border-t-[#d4a017] p-5 z-50 normal-case font-normal">
                <p className="font-bold text-xs uppercase tracking-wider text-[#d4a017] border-b border-[#e4dac9] pb-2 mb-3">
                  Explorez nos Parfums par Famille Olfactive
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {FAMILY_LINKS.map((f) => (
                    <Link
                      key={f.name}
                      href={f.href}
                      className="p-2.5 rounded border border-gray-100 hover:border-[#d4a017] hover:bg-[#fdfaf4] transition-colors block"
                    >
                      <span className="font-bold text-xs text-[#111827] block">{f.name} ›</span>
                      <span className="text-[11px] text-gray-500">{f.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* 7. BESTSELLERS */}
            <li>
              <Link
                href="/shop/all?sort=bestsellers"
                className="flex items-center gap-1 py-3 px-3 text-[#d4a017] hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <span>★ Meilleures Ventes</span>
              </Link>
            </li>

            {/* 8. TROUVER MON PARFUM */}
            <li>
              <Link
                href="/trouver-mon-parfum"
                className="flex items-center gap-1 py-2 my-1 px-3 bg-[#d4a017] text-[#111827] hover:bg-white hover:text-[#111827] rounded-[2px] transition-colors font-extrabold"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Trouver mon Parfum</span>
              </Link>
            </li>

          </ul>
        </div>
      </nav>
    </header>
  );
}
