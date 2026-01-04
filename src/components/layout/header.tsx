
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
import { PerfumeFinderCta } from '../perfume-finder-cta';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { PerfumeFinder } from '../perfume-finder';

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
    <header className="sticky md:fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between lg:grid lg:grid-cols-[200px_1fr_200px] lg:gap-4 relative">
        {/* Left Section: Mobile Menu + Theme Toggle / Desktop Logo */}
        <div className="flex items-center gap-2 lg:justify-start">
             {/* Mobile menu burger */}
             <div className="lg:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6 icon-hover" />
                            <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b">
                          <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                          <SheetDescription className="sr-only">Naviguez à travers les différentes sections du site.</SheetDescription>
                           <div className="flex items-center justify-between">
                             <span className="font-bold text-lg font-headline">Menu</span>
                          </div>
                        </SheetHeader>
                        <ScrollArea className="flex-1">
                            <div className="flex flex-col gap-4 p-4">
                                <Link href="/shop" onClick={handleLinkClick} className="text-base font-semibold">Boutique</Link>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="french-avenue">
                                        <AccordionTrigger>French Avenue</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-2 pl-4">
                                                <Link href="/shop?brands=French%20Avenue" onClick={handleLinkClick} className="text-sm">Tous les parfums</Link>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="fragrance-world">
                                        <AccordionTrigger>Fragrance World</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-2 pl-4">
                                                <Link href="/shop?brands=Fragrance%20World" onClick={handleLinkClick} className="text-sm">Tous les parfums</Link>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="maison-alhambra">
                                        <AccordionTrigger>Maison Alhambra</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-2 pl-4">
                                                <Link href="/shop?brands=Maison%20Alhambra" onClick={handleLinkClick} className="text-sm">Tous les parfums</Link>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="lattafa">
                                        <AccordionTrigger>Lattafa</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-2 pl-4">
                                                <Link href="/shop?brands=Lattafa" onClick={handleLinkClick} className="text-sm">Tous les parfums</Link>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <Link href="/blog" onClick={handleLinkClick} className="text-base font-semibold">Blog</Link>
                                <Link href="/about" onClick={handleLinkClick} className="text-base font-semibold">À Propos</Link>
                                <Link href="/contact" onClick={handleLinkClick} className="text-base font-semibold">Contact</Link>
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Mobile theme toggle - à gauche pour symétrie */}
            <div className="lg:hidden">
              <ThemeToggle />
            </div>

             {/* Desktop logo - à gauche */}
             <Link href="/" className="hidden lg:flex items-center">
                <Image
                    src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1765916140/ChatGPT_Image_16_d%C3%A9c._2025_21_14_32_1_ajws49.png"
                    alt="DubaiNegoce Logo"
                    width={560}
                    height={160}
                    className="object-contain h-40"
                    priority
                />
            </Link>
        </div>

        {/* Center Section: Navigation Menu (Desktop) / Centered Logo (Mobile) */}
        <div className="flex justify-center items-center">
            <Link href="/" className="lg:hidden flex items-center">
                 <Image
                    src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1765916140/ChatGPT_Image_16_d%C3%A9c._2025_21_14_32_1_ajws49.png"
                    alt="DubaiNegoce Logo"
                    width={560}
                    height={160}
                    className="object-contain h-40"
                    priority
                />
            </Link>
            <div className="hidden lg:flex">
                <NavigationMenu>
                    <NavigationMenuList>
                         <NavigationMenuItem>
                            <NavigationMenuTrigger>Boutique</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                        <a
                                            className="relative flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md overflow-hidden"
                                            href="/shop"
                                        >
                                            <Image
                                                src="https://res.cloudinary.com/dhjwimevi/image/upload/v1765701180/vanilla_so_sweet_nrxsay.png"
                                                alt="Parfum en promotion"
                                                fill
                                                className="object-cover"
                                                sizes="200px"
                                            />
                                            <div className="absolute inset-0 bg-black/50"></div>
                                            <div className="relative z-10 text-white">
                                                <Package className="h-6 w-6 icon-gold" />
                                                <div className="mb-2 mt-4 text-lg font-medium shimmer-gold">
                                                    Toute la collection
                                                </div>
                                                <p className="text-sm leading-tight text-white/80">
                                                    Explorez tous nos trésors olfactifs importés de Dubaï.
                                                </p>
                                            </div>
                                        </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/shop/all?brands=Lattafa" title="Lattafa">
                                        Le leader incontesté des parfums orientaux.
                                    </ListItem>
                                    <ListItem href="/shop/all?brands=Maison%20Alhambra" title="Maison Alhambra">
                                        L'art du dupe de luxe, par Lattafa.
                                    </ListItem>
                                    <ListItem href="/shop/all?brands=Fragrance%20World" title="Fragrance World">
                                        Créativité et audace dans chaque flacon.
                                    </ListItem>
                                     <ListItem href="/shop/all?brands=French%20Avenue" title="French Avenue">
                                        L'élégance française, l'inspiration d'ailleurs.
                                     </ListItem>
                                    <li className="col-start-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="flex w-full items-center gap-2 rounded-md p-3 hover:bg-accent transition-colors">
                                                    <Sparkles className="h-5 w-5 icon-hover" />
                                                    <div>
                                                        <p className="text-sm font-medium">Trouver mon parfum</p>
                                                        <p className="text-xs text-muted-foreground">Nos experts vous conseillent pour trouver votre sillage parfait.</p>
                                                    </div>
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-4xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-3xl font-headline text-primary text-center">Votre Sillage Unique</DialogTitle>
                                                    <DialogDescription className="text-center">
                                                    Laissez-nous vous guider vers le parfum de vos rêves.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <PerfumeFinder />
                                            </DialogContent>
                                        </Dialog>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                                <Link href="/blog">Blog</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                                <Link href="/about">À Propos</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                                <Link href="/contact">Contact</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>

        {/* Right Section: Search Bar & Icons */}
        <div className="flex items-center justify-end gap-2">
            <div className="hidden lg:block lg:max-w-[180px]">
                <SearchBar />
            </div>

            {/* Theme toggle - uniquement desktop (mobile à gauche) */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {!isUserLoading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-8 w-8 border-2 border-primary">
                            <AvatarFallback className="bg-primary text-secondary-foreground font-semibold">{getInitials(user.displayName || user.email)}</AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/account">Profil</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/account/orders">Mes commandes</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/login">
                    <User className="h-5 w-5 icon-hover" />
                    <span className="sr-only">Compte</span>
                  </Link>
                </Button>
              )
            )}

            <Button variant="ghost" size="icon" asChild>
                <Link href="/cart">
                    <div className="relative">
                        <ShoppingCart className="h-5 w-5 icon-hover" />
                        {isMounted && cartCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-4 w-4 justify-center rounded-full p-0 text-xs bg-primary text-white border-0">
                            {cartCount}
                            </Badge>
                        )}
                    </div>
                <span className="sr-only">Panier</span>
                </Link>
            </Button>
        </div>
      </div>

      {/* Mobile Search Bar - Below Header */}
      <div className="lg:hidden border-t bg-background">
        <div className="container py-2 flex justify-center">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
