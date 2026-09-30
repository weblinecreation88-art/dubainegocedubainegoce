import { Metadata } from 'next';
import { Truck, CreditCard, ShieldCheck, MapPin, Package, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Livraison et Paiement | Dubaï Négoce',
    description: 'Découvrez nos options de livraison rapides et nos moyens de paiement 100% sécurisés. Colissimo, Mondial Relay, Apple Pay, Google Pay et plus.',
};

export default function DeliveryAndPaymentPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header court */}
            <section className="bg-black text-white py-16 md:py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Livraison & Paiement</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Rapide, fiable et sécurisé. Voici tout ce que vous devez savoir sur vos commandes chez Dubaï Négoce.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Section Livraison */}
                    <div>
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <Truck className="w-8 h-8 text-black dark:text-white" />
                            <h2 className="text-3xl font-headline">Modes de Livraison</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                                <div className="flex items-start gap-4">
                                    <div className="bg-black shrink-0 text-white w-12 h-12 flex items-center justify-center rounded-full">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Mondial Relay (Point Relais)</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Faites-vous livrer dans le point relais de votre choix, près de chez vous ou de votre lieu de travail.
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex justify-between items-center bg-white dark:bg-black p-3 rounded shadow-sm">
                                                <span className="font-medium">Délai estimé</span>
                                                <span>3 à 5 jours ouvrés</span>
                                            </li>
                                            <li className="flex justify-between items-center bg-white dark:bg-black p-3 rounded shadow-sm">
                                                <span className="font-medium">Tarif</span>
                                                <span>À partir de <strong className="text-black dark:text-white text-base">4,49 €</strong> (selon poids)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                                <div className="flex items-start gap-4">
                                    <div className="bg-black shrink-0 text-white w-12 h-12 flex items-center justify-center rounded-full">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Colissimo (À domicile)</h3>
                                        <p className="text-muted-foreground mb-4">
                                            La livraison classique et rapide directement dans votre boîte aux lettres par La Poste.
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex justify-between items-center bg-white dark:bg-black p-3 rounded shadow-sm">
                                                <span className="font-medium">Délai estimé</span>
                                                <span>48 heures (2 jours ouvrés)</span>
                                            </li>
                                            <li className="flex justify-between items-center bg-white dark:bg-black p-3 rounded shadow-sm">
                                                <span className="font-medium">Tarif</span>
                                                <span>Calculé à l'étape du paiement</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground italic mt-4 text-center">
                                *Toutes nos commandes sont préparées et expédiées sous 24h ouvrées (hors week-end et jours fériés).
                            </p>
                        </div>
                    </div>

                    {/* Section Paiement */}
                    <div>
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <CreditCard className="w-8 h-8 text-black dark:text-white" />
                            <h2 className="text-3xl font-headline">Moyens de Paiement</h2>
                        </div>

                        <div className="space-y-6">
                            <p className="text-muted-foreground mb-6">
                                Pour garantir une sécurité maximale lors de vos achats, toutes nos transactions sont cryptées et traitées par des partenaires de confiance.
                            </p>

                            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-lg text-center flex flex-col items-center">
                                <ShieldCheck className="w-10 h-10 mb-4 text-emerald-600 dark:text-emerald-500" />
                                <h3 className="font-bold text-lg mb-2">Paiement 100% Sécurisé (Stripe)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Nous utilisons Stripe pour traiter vos paiements. Vos données bancaires ne sont jamais stockées sur nos serveurs.
                                </p>
                                <div className="flex justify-center gap-3 mt-4">
                                    <span className="px-3 flex items-center justify-center py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded border border-gray-200 dark:border-gray-700">Visa</span>
                                    <span className="px-3 flex items-center justify-center py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded border border-gray-200 dark:border-gray-700">Mastercard</span>
                                    <span className="px-3 flex items-center justify-center py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded border border-gray-200 dark:border-gray-700">Amex</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-lg text-center flex flex-col items-center">
                                <Smartphone className="w-10 h-10 mb-4 text-black dark:text-white" />
                                <h3 className="font-bold text-lg mb-2">Paiement Mobile Rapide</h3>
                                <p className="text-sm text-muted-foreground">
                                    Réglez vos achats en un clic grâce à vos portefeuilles électroniques directement depuis votre smartphone ou navigateur compatible.
                                </p>
                                <div className="flex justify-center gap-4 mt-4">
                                    <span className="px-4 flex items-center justify-center py-2 bg-black text-white text-sm font-semibold rounded-full w-full max-w-[140px]">Apple Pay</span>
                                    <span className="px-4 flex items-center justify-center py-2 bg-white text-gray-800 border border-gray-300 text-sm font-semibold rounded-full w-full max-w-[140px] shadow-sm">Google Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
