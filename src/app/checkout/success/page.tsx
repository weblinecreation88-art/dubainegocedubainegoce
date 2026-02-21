'use client';

import { useEffect, Suspense } from 'react';
import { useCart } from '@/context/cart-context';
import { Loader2, CheckCircle, MailCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GoogleAdsConversionTracker } from '@/components/google-ads-conversion-tracker';
import { useSearchParams } from 'next/navigation';

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-875971831';
const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || 'p87pCJPoh9UbEPeJ2aED';


function SuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('session_id');
    const totalAmount = searchParams.get('total');

    useEffect(() => {
        clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <GoogleAdsConversionTracker 
                googleAdsId={GOOGLE_ADS_ID}
                conversionLabel={GOOGLE_ADS_CONVERSION_LABEL}
                transactionId={transactionId}
                value={totalAmount ? parseFloat(totalAmount) : 0}
            />
            <Card>
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 w-fit">
                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-3xl font-headline mt-4">Paiement réussi !</CardTitle>
                    <CardDescription>
                        Votre commande a bien été prise en compte.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="text-center text-secondary-foreground bg-secondary p-4 rounded-md flex items-center justify-center gap-3">
                        <MailCheck className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>Un e-mail de confirmation vous sera envoyé d'une minute à l'autre.</span>
                    </div>
                </CardContent>
                 <CardFooter className="flex justify-center">
                    <Button asChild variant="outline">
                        <Link href="/shop">
                            Continuer mes achats
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
