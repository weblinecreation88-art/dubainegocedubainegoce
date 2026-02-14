
'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ShoppingCart, User, Package, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';
import { useCart } from '@/context/cart-context';
import { Badge } from '../ui/badge';
import Image from 'next/image';
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
import { SearchBar } from '../search-bar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


export default function Header() {
  const { getCartCount, clearCart } = useCart();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out py-4",
      isScrolled ? "bg-white/90 backdrop-blur-md border-b border-black/5 py-2" : "bg-white border-b border-black/5"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* Left Section: Mobile Menu / Desktop Nav links */}
        <div className="flex-1 flex items-center">
          <div className="lg:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <Menu className="h-5 w-5 icon-luxury" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r-0 p-0 font-luxury-body">
                <div className="p-8 flex flex-col gap-8 mt-12">
                  <Link href="/shop" onClick={handleLinkClick} className="text-sm uppercase tracking-widest text-black hover:text-[#D4AF37] transition-colors">Boutique</Link>
                  <Link href="/shop/all?brands=Lattafa" onClick={handleLinkClick} className="text-sm uppercase tracking-widest text-black hover:text-[#D4AF37] transition-colors">Lattafa</Link>
                  <Link href="/shop/all?brands=French%20Avenue" onClick={handleLinkClick} className="text-sm uppercase tracking-widest text-black hover:text-[#D4AF37] transition-colors">French Avenue</Link>
                  <Link href="/blog" onClick={handleLinkClick} className="text-sm uppercase tracking-widest text-black hover:text-[#D4AF37] transition-colors">Blog</Link>
                  <Link href="/contact" onClick={handleLinkClick} className="text-sm uppercase tracking-widest text-black hover:text-[#D4AF37] transition-colors">Contact</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/shop" className="text-[10px] uppercase tracking-[0.25em] font-luxury-body text-black hover:text-[#D4AF37] transition-colors">Boutique</Link>
            <Link href="/shop/all?brands=Lattafa" className="text-[10px] uppercase tracking-[0.25em] font-luxury-body text-black hover:text-[#D4AF37] transition-colors">Lattafa</Link>
            <Link href="/shop/all?brands=French%20Avenue" className="text-[10px] uppercase tracking-[0.25em] font-luxury-body text-black hover:text-[#D4AF37] transition-colors">French Avenue</Link>
          </div>
        </div>

        {/* Center Section: Logo */}
        <div className="flex-none px-4">
          <Link href="/" className="block">
            <h1 className="text-2xl md:text-3xl font-luxury-headline text-black tracking-tighter logo-shimmer">
              DUBAINEGOCE
            </h1>
          </Link>
        </div>

        {/* Right Section: Icons */}
        <div className="flex-1 flex items-center justify-end gap-1 md:gap-4">
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {!isUserLoading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-transparent">
                    <User className="h-5 w-5 icon-luxury" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="font-luxury-body text-xs">
                  <DropdownMenuLabel className="uppercase tracking-widest">Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/account">Profil</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/account/orders">Commandes</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="hover:bg-transparent">
                <Link href="/login">
                  <User className="h-5 w-5 icon-luxury" />
                </Link>
              </Button>
            )
          )}

          <Button variant="ghost" size="icon" asChild className="hover:bg-transparent">
            <Link href="/cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 icon-luxury" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#D4AF37] text-[8px] text-white">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
