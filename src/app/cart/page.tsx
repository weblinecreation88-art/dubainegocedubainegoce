
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, Loader2, TicketPercent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ShippingMethod } from '@/lib/types';
import { shippingMethods, getColissimoCost, getMondialRelayCost } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

const PERFUME_WEIGHT_G = 750;

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartCount, clearCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState<ShippingMethod['id']>('mondial-relay');
  const [isClient, setIsClient] = useState(false);
  const [shouldAutoCheckout, setShouldAutoCheckout] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);

    // Check if user just came back from login
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('fromLogin') === 'true' && user) {
      setShouldAutoCheckout(true);
      // Clean up URL
      router.replace('/cart', { scroll: false });
    }

    const handlePopState = () => {
      setIsCheckingOut(false);
    };

    window.addEventListener('popstate', handlePopState);

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            setIsCheckingOut(false);
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, router]);

  const totalItems = getCartCount();
  const totalWeight = totalItems * PERFUME_WEIGHT_G;

  const dynamicShippingMethods = useMemo((): ShippingMethod[] => {
    return shippingMethods.map(method => {
      if (method.id === 'colissimo') {
        return { ...method, cost: getColissimoCost(totalWeight) };
      }
      if (method.id === 'mondial-relay') {
        return { ...method, cost: getMondialRelayCost(totalWeight) };
      }
      return { ...method, cost: 0 }; // Fallback for other methods
    });
  }, [totalWeight]);

  const selectedShipping = useMemo(() => {
    return dynamicShippingMethods.find(m => m.id === selectedShippingId) || dynamicShippingMethods[0];
  }, [selectedShippingId, dynamicShippingMethods]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const shippingCost = selectedShipping?.cost || 0;
  const totalAmount = subtotal + shippingCost;

  const handleCheckout = useCallback(async () => {
    if (!user) {
      router.push('/login?redirect=/cart&fromLogin=true');
      return;
    }

    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des produits avant de passer commande.",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    images: [item.image],
                    metadata: {
                       productId: item.id,
                    }
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lineItems,
            userId: user.uid,
            shippingMethod: selectedShipping.id,
            totalAmount: totalAmount.toFixed(2),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la création de la session');
        }

        if (data.url) {
          window.location.assign(data.url);
        } else {
          throw new Error('URL de paiement non reçue');
        }
    } catch(error: any) {
        console.error("Error creating checkout session:", error);
         toast({
            variant: "destructive",
            title: "Erreur de paiement",
            description: error.message || "Une erreur est survenue lors de la création de la session de paiement.",
        })
        setIsCheckingOut(false);
    }
  }, [user, router, cart, toast, totalAmount, selectedShipping]);

  // Auto-checkout when returning from login
  useEffect(() => {
    if (shouldAutoCheckout && user && cart.length > 0 && !isCheckingOut) {
      setShouldAutoCheckout(false);
      // Small delay to ensure state is ready
      const timer = setTimeout(() => {
        handleCheckout();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoCheckout, user, cart.length, isCheckingOut]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline">Votre Panier</h1>
        <p className="text-muted-foreground mt-2">
          {!isClient ? 'Chargement...' : totalItems > 0 ? `Vous avez ${totalItems} article(s) dans votre panier.` : 'Votre panier est actuellement vide.'}
        </p>
      </div>

      {!isClient || cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center bg-card p-12 rounded-lg">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-headline">Votre panier est vide</h2>
            <p className="text-muted-foreground mt-2 max-w-md mb-6">
                On dirait que vous n'avez pas encore ajouté de trésors olfactifs.
            </p>
            <Button asChild>
                <Link href="/shop">Continuer mes achats</Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <Card key={item.id} className="flex items-center p-4">
                <div className="relative h-24 w-24 rounded-md overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-grow ml-4">
                  <Link href={`/parfum/${item.slug}`} className="font-semibold hover:text-primary">{item.name}</Link>
                  <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} €</p>
                  <div className="flex items-center mt-2">
                    <label htmlFor={`quantity-${item.id}`} className="text-sm mr-2">Qté:</label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="h-8 w-16"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full ml-4">
                     <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} aria-label="Supprimer l'article">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
              </Card>
            ))}
             <div className="text-right mt-4">
                <Button variant="outline" onClick={clearCart}>
                    Vider le panier
                </Button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 sticky top-24">
             <Card>
                <CardHeader>
                    <CardTitle>Méthode de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedShippingId}
                        onValueChange={(id: ShippingMethod['id']) => setSelectedShippingId(id)}
                        className="space-y-4"
                    >
                       {dynamicShippingMethods.map((method) => (
                         <Label
                           key={method.id}
                           htmlFor={method.id}
                           className={cn(
                               "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors",
                               selectedShippingId === method.id && "border-primary ring-2 ring-primary"
                           )}
                         >
                           <RadioGroupItem value={method.id} id={method.id} />
                           <method.icon className="h-6 w-6 text-muted-foreground" />
                           <div className="flex-1">
                               <p className="font-semibold">{method.name}</p>
                               <p className="text-sm text-muted-foreground">{method.description}</p>
                           </div>
                           <p className="font-semibold text-sm">
                                {method.cost > 0 ? `${method.cost.toFixed(2)} €` : 'Gratuit'}
                           </p>
                         </Label>
                       ))}
                    </RadioGroup>
                </CardContent>
             </Card>
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)} €` : 'Gratuite'}</span>
                </div>
                <Separator />
                 <p className="text-sm text-muted-foreground">
                    Vous avez un code promo ? Vous pourrez l'ajouter sur la page de paiement.
                 </p>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{totalAmount.toFixed(2)} €</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut || cart.length === 0}>
                  {isCheckingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                   {user ? 'Passer la commande' : 'Se connecter pour commander'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

    