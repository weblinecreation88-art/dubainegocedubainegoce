'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ShoppingCart, User, Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Badge } from '../ui/badge';
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
import { Avatar, AvatarFallback } from '../ui/avatar';
import { SearchDialog } from '../search-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ScrollArea } from '../ui/scroll-area';
import { ThemeToggle } from '../theme-toggle';
import { isAdminEmail } from '@/lib/admin-emails';

export default function Header() {
  const { getCartCount, clearCart } = useCart();
  const { user, isUserLoading } = useUser();
  const { wishlist } = useWishlist();
  const auth = useAuth();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = getCartCount();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      clearCart();
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[1]) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  }

  return (
    <div className="w-full bg-white text-black border-b border-gray-200 flex flex-col">
      {/* Main Row */}
      <div className="container relative flex h-14 items-center">

        {/* LEFT: Menu burger (mobile) | Logo (desktop) */}
        <div className="flex items-center gap-1 lg:gap-4 z-10">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-black hover:text-gray-600 hover:bg-gray-100" aria-label="Ouvrir le menu">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 flex flex-col bg-background text-foreground">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                  <SheetDescription className="sr-only">Naviguez à travers les différentes sections du site.</SheetDescription>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg font-headline">Menu</span>
                    <ThemeToggle />
                  </div>
                </SheetHeader>
                <ScrollArea className="flex-1">
                  <div className="flex flex-col gap-4 p-4">
                    <Link href="/shop" onClick={handleLinkClick} className="text-base font-semibold">Toute la Boutique</Link>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="maisons">
                        <AccordionTrigger>Marques de Parfums</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-3 pl-4 pt-2">
                            <Link href="/shop/marque/lattafa" onClick={handleLinkClick} className="text-sm">Lattafa</Link>
                            <Link href="/shop/marque/french-avenue" onClick={handleLinkClick} className="text-sm">French Avenue</Link>
                            <Link href="/shop/marque/maison-alhambra" onClick={handleLinkClick} className="text-sm">Maison Alhambra</Link>
                            <Link href="/shop/marque/fragrance-world" onClick={handleLinkClick} className="text-sm">Fragrance World</Link>
                            <Link href="/shop/marque/ard-al-zaafaran" onClick={handleLinkClick} className="text-sm">Ard Al Zaafaran</Link>
                            <Link href="/shop/marque/asdaaf" onClick={handleLinkClick} className="text-sm">Asdaaf</Link>
                            <Link href="/shop/marque/paris-corner" onClick={handleLinkClick} className="text-sm">Paris Corner</Link>
                            <Link href="/shop/marque/mirada" onClick={handleLinkClick} className="text-sm">MIRADA</Link>
                            <Link href="/shop/marque/hamidi" onClick={handleLinkClick} className="text-sm">Hamidi</Link>
                            <Link href="/shop/all" onClick={handleLinkClick} className="text-sm font-semibold text-accent">→ Toutes les marques</Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="collections">
                        <AccordionTrigger>Nos Collections</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-3 pl-4 pt-2">
                            <Link href="/shop/type/oriental" onClick={handleLinkClick} className="text-sm">Parfums Orientaux</Link>
                            <Link href="/shop/type/original" onClick={handleLinkClick} className="text-sm">Créations Originales</Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Link href="/blog" onClick={handleLinkClick} className="text-base font-semibold">Blog</Link>
                    <Link href="/about" onClick={handleLinkClick} className="text-base font-semibold">À Propos</Link>
                    <Link href="/wishlist" onClick={handleLinkClick} className="flex items-center gap-2 text-base font-semibold">
                      <Heart className="h-5 w-5" />
                      <span>Mes Favoris ({wishlist.length})</span>
                    </Link>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - desktop only */}
          <Link href="/" className="hidden lg:flex items-center" aria-label="Accueil Dubaï Négoce">
            <span className="font-headline font-bold text-xl md:text-2xl tracking-widest uppercase">
              Dubaï Négoce
            </span>
          </Link>
        </div>

        {/* CENTER - Logo mobile (centré) | Nav desktop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            {/* Logo centré - mobile only */}
            <Link href="/" className="lg:hidden flex items-center" aria-label="Accueil Dubaï Négoce">
              <span className="font-headline font-bold text-lg sm:text-xl tracking-wider uppercase whitespace-nowrap">
                Dubaï Négoce
              </span>
            </Link>

            {/* Navigation desktop simplifiée et orientée conversion */}
            <div className="hidden lg:flex items-center justify-center gap-10 text-sm font-bold tracking-widest uppercase">
              <Link href="/shop" className="hover:text-[#c9a96e] transition-colors">
                Boutique
              </Link>
              <Link href="/shop/all?sort=bestsellers" className="hover:text-[#c9a96e] transition-colors">
                Bestsellers
              </Link>
              <Link href="/shop/type/oriental" className="text-[#c9a96e] hover:text-[#b8944e] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#c9a96e]">
                Parfums Orientaux
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT: Search + User + Wishlist + Cart + Theme */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:gap-3 z-10">
          {/* Search - visible sur tous les écrans à droite */}
          <SearchDialog>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-black hover:text-gray-600 hover:bg-gray-100" aria-label="Rechercher">
              <Search className="h-5 w-5" />
              <span className="sr-only">Rechercher</span>
            </Button>
          </SearchDialog>

          {/* User - toujours visible avec placeholder anti-CLS */}
          {isUserLoading ? (
            <div className="h-9 w-9 rounded-full bg-transparent" aria-hidden="true" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100 p-0" aria-label="Menu compte">
                  <Avatar className="h-8 w-8 border border-gray-300">
                    <AvatarFallback className="bg-gray-100 text-black text-xs">{getInitials(user.displayName || user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-foreground bg-background">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/account">Profil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/account/orders">Mes commandes</Link></DropdownMenuItem>
                {isAdminEmail(user?.email) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/admin">📊 Tableau de Bord Admin</Link></DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-black hover:text-gray-600 hover:bg-gray-100">
              <Link href="/login" aria-label="Mon Compte">
                <User className="h-5 w-5" />
                <span className="sr-only">Compte</span>
              </Link>
            </Button>
          )}

          {/* Heart / Favoris - visible dès sm */}
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex h-9 w-9 text-black hover:text-gray-600 hover:bg-gray-100 relative" title="Mes Favoris">
            <Link href="/wishlist" aria-label="Mes Favoris">
              <Heart className="h-5 w-5" />
              {isMounted && wishlist.length > 0 && (
                <Badge className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center rounded-full p-0 text-[10px] transform translate-x-1/4 -translate-y-1/4 border-none bg-accent text-accent-foreground">
                  {wishlist.length}
                </Badge>
              )}
              <span className="sr-only">Favoris</span>
            </Link>
          </Button>

          {/* Panier - toujours visible */}
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-black hover:text-gray-600 hover:bg-gray-100 relative">
            <Link href="/cart" aria-label="Panier">
              <ShoppingCart className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center rounded-full p-0 text-[10px] transform translate-x-1/4 -translate-y-1/4 border-none bg-accent text-accent-foreground">
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Panier</span>
            </Link>
          </Button>

          {/* Theme Toggle - desktop only */}
          <div className="hidden lg:block ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
