
import Link from 'next/link';
import { XCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CheckoutCancelPage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
            <Card>
                <CardHeader>
                    <div className="mx-auto bg-red-100 dark:bg-red-900 rounded-full p-3 w-fit">
                        <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-3xl font-headline mt-4">Paiement annulé</CardTitle>
                    <CardDescription>
                        Votre paiement n'a pas pu être traité ou vous avez annulé la transaction.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        Aucun prélèvement n'a été effectué. Votre panier a été sauvegardé si vous souhaitez réessayer.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/cart">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Retourner au panier
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/shop">Continuer mes achats</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
