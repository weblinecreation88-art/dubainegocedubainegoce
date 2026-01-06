
import { Metadata } from 'next';
import { ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Promotions',
    description: 'Découvrez nos offres spéciales sur une sélection de parfums.',
};

export default function PromoPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Promotions</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Le luxe accessible, encore plus avantageux.
                </p>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center bg-card p-12 rounded-lg mt-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-headline">Aucune promotion pour le moment</h2>
                <p className="text-muted-foreground mt-2 max-w-md">
                    Nos parfums sont déjà au prix juste toute l'année. Revenez bientôt pour d'éventuelles offres spéciales !
                </p>
            </div>
        </div>
    );
}
