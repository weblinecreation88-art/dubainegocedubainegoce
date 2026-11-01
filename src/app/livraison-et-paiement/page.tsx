import { Metadata } from 'next';
import Link from 'next/link';
import { Truck, CreditCard, ShieldCheck, Package } from 'lucide-react';
import { PaymentBadges } from '@/components/ui/payment-badges';

export const metadata: Metadata = {
  title: 'Livraison et Paiement | Dubaï Négoce',
  description:
    'Consultez nos tarifs de livraison Colissimo (offerte dès 2 parfums) et nos moyens de paiement sécurisés (CB, Visa, Mastercard, Apple Pay, Google Pay).',
};

export default function DeliveryAndPaymentPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="Fil d'Ariane" className="mb-6 text-xs text-gray-600 bg-white border border-[#e6ded1] rounded px-3.5 py-2">
        <Link href="/" className="hover:text-[#a8834f]">Accueil</Link>
        <span className="mx-2">&gt;</span>
        <span className="font-bold text-[#1d1a16]">Livraison &amp; Paiement</span>
      </nav>

      <div className="bg-white border border-[#e6ded1] rounded p-6 sm:p-8 text-[#1d1a16]">
        <div className="border-b border-[#e6ded1] pb-5 mb-8">
          <h1 className="text-2xl sm:text-3xl font-headline font-bold mb-2">
            Livraison &amp; Paiement Sécurisé
          </h1>
          <p className="text-sm text-gray-600">
            Les tarifs affichés ci-dessous sont exactement ceux appliqués dans votre panier et lors du règlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonne Livraison */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#e6ded1]">
              <Truck className="w-5 h-5 text-[#a8834f]" />
              <h2 className="text-lg font-headline font-bold">Livraison Colissimo Domicile</h2>
            </div>

            <div className="bg-[#faf7f2] p-5 rounded border border-[#e6ded1] space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-[#1d1a16] text-[#a8834f] w-10 h-10 flex items-center justify-center rounded shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Colissimo Domicile avec suivi</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Livraison à l&apos;adresse indiquée avec numéro de suivi envoyé par e-mail.
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex justify-between items-center bg-white p-2.5 rounded border border-[#e6ded1]">
                  <span>1 parfum (flacon 100 ml)</span>
                  <strong className="text-[#1d1a16]">7,10 € TTC</strong>
                </li>
                <li className="flex justify-between items-center bg-[#f3ede3] p-2.5 rounded border border-[#a8834f]">
                  <span className="font-bold">Dès 2 parfums</span>
                  <strong className="text-[#46a74e]">OFFERT (0,00 €)</strong>
                </li>
              </ul>

              <p className="text-xs text-gray-600">
                Consultez également notre{' '}
                <Link href="/shipping" className="text-[#a8834f] font-semibold underline">
                  politique de retour sous 14 jours
                </Link>.
              </p>
            </div>
          </div>

          {/* Colonne Paiement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#e6ded1]">
              <CreditCard className="w-5 h-5 text-[#a8834f]" />
              <h2 className="text-lg font-headline font-bold">Moyens de Paiement Acceptés</h2>
            </div>

            <div className="bg-[#faf7f2] p-5 rounded border border-[#e6ded1] space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-[#46a74e] text-white w-10 h-10 flex items-center justify-center rounded shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Transactions chiffrées SSL / 3D Secure</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Vos règlements sont traités de bout en bout par <strong>Stripe</strong>. Aucune coordonnée bancaire n&apos;est conservée par notre boutique.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-[#e6ded1]">
                <PaymentBadges
                  title="Moyens disponibles à l'étape du paiement :"
                  badgeClassName="h-7"
                  align="left"
                />
              </div>

              <ul className="space-y-1.5 text-xs text-gray-700 list-disc pl-4">
                <li><strong>Carte Bancaire (CB, Visa, Mastercard)</strong> via Stripe sécurisé</li>
                <li><strong>Apple Pay &amp; Google Pay</strong> sur les appareils et navigateurs compatibles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
