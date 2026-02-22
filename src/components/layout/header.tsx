'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ShoppingCart, User, Sparkles, Phone, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Badge } from '../ui/badge';
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { PerfumeFinder } from '../perfume-finder';
import { ThemeToggle } from '../theme-toggle';

export default function Header() {
  const { getCartCount, clearCart } = useCart();
  const { user, isUserLoading } = useUser();
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
    <header className="sticky top-0 z-50 w-full bg-black text-white border-b border-gray-900 flex flex-col">
      {/* Top Utility Bar */}
      <div className="hidden md:flex w-full bg-zinc-900 border-b border-zinc-800 text-xs text-gray-300 py-1.5">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-gray-400" />
            <span>Service Client : <a href="tel:+33758999726" className="font-semibold hover:text-white transition-colors">+33 7 58 99 97 26</a></span>
          </div>
          <Link href="/livraison-et-paiement" className="flex items-center gap-2 hover:text-white transition-colors group">
            <Truck className="h-3.5 w-3.5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="font-medium">Livraison et Paiement</span>
          </Link>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between">

        {/* Left Section: Mobile Menu & Desktop Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-gray-800">
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
                            <Link href="/shop?brands=Lattafa" onClick={handleLinkClick} className="text-sm">Lattafa</Link>
                            <Link href="/shop?brands=French%20Avenue" onClick={handleLinkClick} className="text-sm">French Avenue</Link>
                            <Link href="/shop?brands=Maison%20Alhambra" onClick={handleLinkClick} className="text-sm">Maison Alhambra</Link>
                            <Link href="/shop?brands=Fragrance%20World" onClick={handleLinkClick} className="text-sm">Fragrance World</Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Link href="/blog" onClick={handleLinkClick} className="text-base font-semibold">Blog</Link>
                    <Link href="/about" onClick={handleLinkClick} className="text-base font-semibold">À Propos</Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex w-full items-center gap-2 rounded-md py-2 text-left font-semibold">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <span>Trouver mon parfum (IA)</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-4xl text-foreground bg-background">
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-headline text-primary text-center">Votre Sillage Unique</DialogTitle>
                          <DialogDescription className="text-center">
                            Laissez-nous vous guider vers le parfum de vos rêves.
                          </DialogDescription>
                        </DialogHeader>
                        <PerfumeFinder />
                      </DialogContent>
                    </Dialog>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-headline font-bold text-xl md:text-2xl tracking-widest uppercase">
              Dubaï Négoce
            </span>
          </Link>
        </div>

        {/* Center Section: Navigation Menu (Desktop) */}
        <div className="hidden lg:flex items-center justify-center gap-8 text-sm font-medium tracking-wide">
          <Link href="/shop?brands=Lattafa" className="hover:text-gray-300 transition-colors uppercase">
            Lattafa
          </Link>
          <Link href="/shop?brands=French%20Avenue" className="hover:text-gray-300 transition-colors uppercase">
            French Avenue
          </Link>
          <Link href="/shop?brands=Maison%20Alhambra" className="hover:text-gray-300 transition-colors uppercase">
            Maison Alhambra
          </Link>
          <Link href="/shop?brands=Fragrance%20World" className="hover:text-gray-300 transition-colors uppercase">
            Fragrance World
          </Link>
          <Link href="/shop" className="hover:text-gray-300 transition-colors opacity-70">
            Tout voir
          </Link>
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center justify-end gap-1 md:gap-3">
          <SearchDialog>
            <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-gray-800">
              <Search className="h-5 w-5" />
              <span className="sr-only">Rechercher</span>
            </Button>
          </SearchDialog>

          <div className="hidden lg:block">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-gray-800" title="Conseiller IA">
                  <Sparkles className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl text-foreground bg-background">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-headline text-primary text-center">Votre Sillage Unique</DialogTitle>
                  <DialogDescription className="text-center">
                    Laissez-nous vous guider vers le parfum de vos rêves.
                  </DialogDescription>
                </DialogHeader>
                <PerfumeFinder />
              </DialogContent>
            </Dialog>
          </div>

          {!isUserLoading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-800 p-0">
                    <Avatar className="h-8 w-8 border border-gray-700">
                      <AvatarFallback className="bg-gray-900 text-white text-xs">{getInitials(user.displayName || user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-foreground bg-background">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/account">Profil</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/account/orders">Mes commandes</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="text-white hover:text-gray-300 hover:bg-gray-800">
                <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Compte</span>
                </Link>
              </Button>
            )
          )}

          <Button variant="ghost" size="icon" asChild className="text-white hover:text-gray-300 hover:bg-gray-800 relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center rounded-full p-0 text-[10px] transform translate-x-1/4 -translate-y-1/4 border-none bg-primary text-primary-foreground">
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Panier</span>
            </Link>
          </Button>

          <div className="hidden lg:block ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
