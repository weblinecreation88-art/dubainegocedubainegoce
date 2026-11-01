'use client';

import { getBrandPath } from '@/lib/catalog-urls';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ShoppingBag, User, Heart, ChevronDown, Trash2, Loader2, X } from 'lucide-react';
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
  { name: 'Lattafa', href: getBrandPath("Lattafa"), desc: 'Khamrah, Yara, Asad, Fakhar...' },
  { name: 'Maison Alhambra', href: getBrandPath("Maison Alhambra"), desc: 'Tobacco Touch, Woody Oud, Grise...' },
  { name: 'French Avenue', href: getBrandPath("French Avenue"), desc: 'Liquid Brun, Spectre, Azzure...' },
  { name: 'Fragrance World', href: getBrandPath("Fragrance World"), desc: 'Barakkat, Cocktail Intense...' },
  { name: 'Paris Corner', href: getBrandPath("Paris Corner"), desc: 'Emir, Pendora Scents, Khair...' },
  { name: 'Ard Al Zaafaran', href: getBrandPath("Ard Al Zaafaran"), desc: 'Oud 24 Hours, Dirham, Mousuf...' },
  { name: 'Asdaaf', href: getBrandPath("Asdaaf"), desc: 'Ameerat Al Arab, Andaleeb...' },
  { name: 'Armaf', href: getBrandPath("Armaf"), desc: 'Club de Nuit, Tag Him...' },
];

const FAMILY_LINKS = [
  { name: 'Boisé & Oud', href: '/shop/all?families=Boisé', desc: 'Sillages nobles, oud royal, santal et cèdre' },
  { name: 'Oriental & Ambré', href: '/shop/all?families=Oriental', desc: 'Notes chaudes d’ambre, épices et résines' },
  { name: 'Gourmand & Vanille', href: '/shop/all?families=Gourmand', desc: 'Vanille, praline, caramel, datte et cannelle' },
  { name: 'Floral & Poudré', href: '/shop/all?families=Floral', desc: 'Rose de Damas, jasmin, fleur d’oranger' },
  { name: 'Frais & Agrumes', href: '/shop/all?families=Hespéridé', desc: 'Bergamote, néroli, notes marines et hespéridées' },
  { name: 'Musc Blanc & Doux', href: '/shop/all?families=Musqué', desc: 'Muscs purs, coton frais et sillage seconde peau' },
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    setIsSearchOpen(false);
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

  const navLinkClass =
    'flex items-center gap-1 py-7 whitespace-nowrap text-[13px] tracking-[0.04em] text-[#1d1a16] hover:text-[#a8834f] transition-colors';
  const megaPanelClass =
    'hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full bg-white text-[#1d1a16] shadow-[0_18px_40px_-20px_rgba(29,26,22,0.35)] border border-[#e6ded1] p-7 z-50';
  const iconButtonClass =
    'relative flex items-center justify-center h-10 w-10 text-[#1d1a16] hover:text-[#a8834f] transition-colors';

  return (
    <header id="header" className="storefront-header w-full bg-white text-[#1d1a16] border-b border-[#e6ded1]">
      <div id="ndkcp-1" className="container mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-16 lg:h-[76px]">

          {/* MENU MOBILE + LOGO */}
          <div className="flex items-center gap-1 lg:gap-0 min-w-0">
            <div className="lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <button type="button" className={iconButtonClass} aria-label="Ouvrir le menu">
                    <Menu className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[310px] sm:w-[360px] p-0 flex flex-col bg-white text-[#1d1a16]">
                  <SheetHeader className="px-6 py-5 bg-[#f3ede3] border-b border-[#e6ded1]">
                    <SheetTitle className="text-left font-headline font-normal text-2xl text-[#1d1a16]">
                      Dubaï Négoce
                    </SheetTitle>
                    <SheetDescription className="text-left text-[11px] uppercase tracking-[0.16em] text-[#6f6559]">
                      Parfums authentiques de Dubaï
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="flex-1">
                    <div className="flex flex-col px-6 py-4 text-[15px]">
                      <Link href="/shop/all" onClick={handleLinkClick} className="py-3 border-b border-[#e6ded1]">
                        Tous les parfums
                      </Link>
                      <Link href="/shop/all?genders=femme" onClick={handleLinkClick} className="py-3 border-b border-[#e6ded1]">
                        Parfums Femme
                      </Link>
                      <Link href="/shop/all?genders=homme" onClick={handleLinkClick} className="py-3 border-b border-[#e6ded1]">
                        Parfums Homme
                      </Link>
                      <Link href="/shop/all?genders=mixte" onClick={handleLinkClick} className="py-3 border-b border-[#e6ded1]">
                        Parfums Mixtes
                      </Link>
                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="marques" className="border-[#e6ded1]">
                          <AccordionTrigger className="py-3 text-[15px] font-normal hover:no-underline">Les maisons</AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col gap-3 pl-3 pt-1 text-sm text-[#4a443c]">
                              {BRAND_LINKS.map((b) => (
                                <Link key={b.name} href={b.href} onClick={handleLinkClick}>
                                  {b.name}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="familles" className="border-[#e6ded1]">
                          <AccordionTrigger className="py-3 text-[15px] font-normal hover:no-underline">Familles olfactives</AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col gap-3 pl-3 pt-1 text-sm text-[#4a443c]">
                              {FAMILY_LINKS.map((f) => (
                                <Link key={f.name} href={f.href} onClick={handleLinkClick}>
                                  {f.name}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <Link href="/trouver-mon-parfum" onClick={handleLinkClick} className="py-3 border-b border-[#e6ded1]">
                        Trouver mon parfum
                      </Link>
                      <div className="pt-6 flex flex-col gap-3 text-sm text-[#5d564c]">
                        <Link href="/suivi-commande" onClick={handleLinkClick}>Suivre ma commande</Link>
                        <Link href="/livraison-et-paiement" onClick={handleLinkClick}>Livraison &amp; paiement</Link>
                        <Link href="/faq" onClick={handleLinkClick}>Questions fréquentes</Link>
                        <Link href="/blog" onClick={handleLinkClick}>Le journal</Link>
                        <Link href="/contact" onClick={handleLinkClick}>Contact</Link>
                        <a href="tel:+33758999726" className="text-[#1d1a16]">07 58 99 97 26</a>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>

            <Link href="/" className="flex items-center gap-2.5 min-w-0" aria-label="Accueil Dubaï Négoce">
              <span
                aria-hidden="true"
                className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1d1a16] font-headline text-[15px] leading-none"
              >
                DN
              </span>
              <span className="font-headline text-[22px] sm:text-[26px] leading-none tracking-[0.01em] text-[#1d1a16] whitespace-nowrap">
                Dubaï Négoce
              </span>
            </Link>
          </div>

          {/* NAVIGATION PRINCIPALE */}
          <nav id="ndkcp-3" aria-label="Navigation principale des catégories" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-8">
              <li className="hidden xl:block"><Link href="/" className={navLinkClass}>Accueil</Link></li>
              <li><Link href="/shop/all?genders=femme" className={navLinkClass}>Femme</Link></li>
              <li><Link href="/shop/all?genders=homme" className={navLinkClass}>Homme</Link></li>
              <li><Link href="/shop/all?genders=mixte" className={navLinkClass}>Mixte</Link></li>
              <li className="relative group">
                <Link href="/shop/all" className={navLinkClass}>
                  Maisons <ChevronDown className="h-3 w-3 opacity-60" />
                </Link>
                <div className={`${megaPanelClass} w-[560px]`}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#6f6559] mb-4">Les maisons de Dubaï</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {BRAND_LINKS.map((b) => (
                      <Link key={b.name} href={b.href} className="group/brand block">
                        <span className="font-headline text-xl block group-hover/brand:text-[#a8834f] transition-colors">{b.name}</span>
                        <span className="text-[11px] text-[#6f6559]">{b.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
              <li className="relative group">
                <Link href="/shop/all" className={navLinkClass}>
                  Familles <ChevronDown className="h-3 w-3 opacity-60" />
                </Link>
                <div className={`${megaPanelClass} w-[520px]`}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#6f6559] mb-4">Par famille olfactive</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {FAMILY_LINKS.map((f) => (
                      <Link key={f.name} href={f.href} className="group/family block">
                        <span className="font-headline text-xl block group-hover/family:text-[#a8834f] transition-colors">{f.name}</span>
                        <span className="text-[11px] text-[#6f6559]">{f.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
              <li><Link href="/trouver-mon-parfum" className={navLinkClass}>Trouver mon parfum</Link></li>
            </ul>
          </nav>

          {/* RECHERCHE + COMPTE + FAVORIS + PANIER */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen((open) => !open)}
              className={iconButtonClass}
              aria-label={isSearchOpen ? 'Fermer la recherche' : 'Rechercher un parfum'}
              aria-expanded={isSearchOpen}
            >
              {isSearchOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Search className="h-5 w-5" strokeWidth={1.5} />}
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`${iconButtonClass} hidden sm:flex`} aria-label="Mon compte client">
                    <User className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 bg-white text-[#1d1a16] border-[#e6ded1] rounded-none">
                  <DropdownMenuLabel className="font-normal">
                    {user.displayName || 'Mon compte'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/account">Mon profil</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/account/orders">Mes commandes</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/suivi-commande">Suivre un colis</Link></DropdownMenuItem>
                  {isAdminEmail(user?.email) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/admin">Administration</Link></DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-700">Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className={`${iconButtonClass} hidden sm:flex`} aria-label="Mon compte client" title="Mon compte">
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            )}

            <Link href="/wishlist" className={`${iconButtonClass} hidden sm:flex`} aria-label="Mes Favoris" title="Mes favoris">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {isMounted && wishlist.length > 0 && (
                <span className="absolute top-1 right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-[#a8834f] text-white text-[9px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <div className="relative group/cart">
              <Link href="/cart" className={iconButtonClass} aria-label={`Voir mon panier (${cartCount})`} title="Voir mon panier">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-[#1d1a16] text-white text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden lg:group-hover/cart:block absolute right-0 top-full pt-3 w-80 z-50">
                <div className="bg-white border border-[#e6ded1] shadow-[0_18px_40px_-20px_rgba(29,26,22,0.35)] text-[#1d1a16]">
                  <div className="px-5 py-4 flex justify-between items-baseline border-b border-[#e6ded1]">
                    <span className="font-headline text-xl">Votre panier</span>
                    <span className="text-[11px] text-[#6f6559]">
                      {cartCount >= 3 ? 'Livraison offerte' : 'Livraison offerte dès 3 parfums'}
                    </span>
                  </div>

                  {!isMounted || cart.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-[#6f6559]">Votre panier est vide.</p>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto divide-y divide-[#e6ded1] px-5">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 py-3">
                            <div className="relative h-14 w-12 bg-[#f3ede3] shrink-0 overflow-hidden">
                              <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/parfum/${item.slug}`} className="text-sm hover:text-[#a8834f] truncate block">
                                {item.name}
                              </Link>
                              <span className="text-[11px] text-[#6f6559]">
                                {item.quantity} × {item.price.toFixed(2).replace('.', ',')} €
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromCart(item.id);
                              }}
                              className="text-[#6f6559] hover:text-red-700 p-1"
                              title="Retirer du panier"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#faf7f2] px-5 py-4 border-t border-[#e6ded1] space-y-2 text-sm">
                        <div className="flex justify-between text-[#5d564c]">
                          <span>Livraison</span>
                          <span>{shippingCost === 0 ? 'Offerte' : `${shippingCost.toFixed(2).replace('.', ',')} €`}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t border-[#e6ded1]">
                          <span>Total TTC</span>
                          <span>{cartTotal.toFixed(2).replace('.', ',')} €</span>
                        </div>
                        <Link
                          href="/cart"
                          className="mt-3 block text-center py-3 bg-[#b8955f] hover:bg-[#a8834f] text-[#1d1a16] text-xs uppercase tracking-[0.14em] transition-colors"
                        >
                          Commander
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECHERCHE DÉPLIABLE */}
      {isSearchOpen && (
        <div className="border-t border-[#e6ded1] bg-white">
          <div id="search_block_top" ref={searchContainerRef} className="container mx-auto px-4 sm:px-6 py-5 relative max-w-3xl">
            <form id="searchbox" onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b border-[#1d1a16]/40 focus-within:border-[#1d1a16]">
              <Search className="h-4 w-4 text-[#6f6559] shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                name="search_query"
                autoFocus
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setShowSearchDropdown(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un parfum, une maison (Khamrah, Yara, Lattafa…)"
                className="flex-1 min-w-0 h-11 bg-transparent text-base text-[#1d1a16] placeholder:text-[#9a9186] focus:outline-none"
              />
              {isSearching && <Loader2 className="h-4 w-4 animate-spin text-[#a8834f]" />}
              <button type="submit" className="text-[11px] uppercase tracking-[0.16em] text-[#1d1a16] hover:text-[#a8834f] shrink-0">
                Rechercher
              </button>
            </form>

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-full -mt-2 bg-white border border-[#e6ded1] shadow-[0_18px_40px_-20px_rgba(29,26,22,0.35)] z-50">
                <div className="divide-y divide-[#e6ded1] max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/parfum/${p.slug}`}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#faf7f2] transition-colors"
                    >
                      <div className="relative h-14 w-12 bg-[#f3ede3] shrink-0 overflow-hidden">
                        <Image src={p.images[0] || '/og-image.png'} alt={p.name} fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-headline text-lg leading-tight truncate">{p.name}</p>
                        <p className="text-[11px] text-[#6f6559]">{p.brand.name} · {p.volumeMl} ml</p>
                      </div>
                      <span className="text-sm shrink-0">{p.price.toFixed(2).replace('.', ',')} €</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/shop/all?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => {
                    setShowSearchDropdown(false);
                    setIsSearchOpen(false);
                  }}
                  className="block text-center py-3 border-t border-[#e6ded1] text-[11px] uppercase tracking-[0.16em] hover:text-[#a8834f]"
                >
                  Voir tous les résultats
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
