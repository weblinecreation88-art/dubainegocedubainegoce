import { Metadata } from 'next';
import Link from 'next/link';
import { Truck, RotateCcw, ShieldCheck, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Expédition et Retours | Dubaï Négoce',
  description:
    'Consultez nos tarifs de livraison Colissimo avec suivi (offerte dès 3 parfums) et notre politique de retour sous 14 jours.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <nav aria-label="Fil d'Ariane" className="mb-6 text-xs text-gray-600 bg-white border border-[#e4dac9] rounded px-3.5 py-2">
        <Link href="/" className="hover:text-[#d4a017]">Accueil</Link>
        <span className="mx-2">&gt;</span>
        <span className="font-bold text-[#111827]">Livraison &amp; Retours</span>
      </nav>

      <div className="bg-white border border-[#e4dac9] rounded p-6 sm:p-8 space-y-8 text-[#111827]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold mb-2">
            Politique d&apos;Expédition et de Retour
          </h1>
          <p className="text-sm text-gray-600">
            Informations transparentes sur la préparation, les frais de livraison appliqués à votre panier et les modalités de retour.
          </p>
        </div>

        {/* Section Expédition */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#e4dac9] pb-2">
            <Truck className="h-5 w-5 text-[#d4a017]" />
            <h2 className="text-lg font-headline font-bold">1. Livraison Colissimo avec Suivi</h2>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            Toutes les commandes sont expédiées via <strong>Colissimo Domicile avec numéro de suivi</strong> communiqué par e-mail dès la prise en charge du colis.
          </p>

          {/* Grille tarifaire identique à computeShippingCost */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-[#e4dac9]">
              <thead>
                <tr className="bg-[#f7f0e6] text-left">
                  <th className="border border-[#e4dac9] p-3 font-bold">Quantité dans le panier</th>
                  <th className="border border-[#e4dac9] p-3 font-bold">Mode d&apos;envoi</th>
                  <th className="border border-[#e4dac9] p-3 font-bold">Tarif TTC (France)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#e4dac9] p-3">1 parfum</td>
                  <td className="border border-[#e4dac9] p-3">Colissimo Domicile suivi</td>
                  <td className="border border-[#e4dac9] p-3 font-bold">7,10 €</td>
                </tr>
                <tr className="bg-[#fdfaf4]">
                  <td className="border border-[#e4dac9] p-3">2 parfums</td>
                  <td className="border border-[#e4dac9] p-3">Colissimo Domicile suivi</td>
                  <td className="border border-[#e4dac9] p-3 font-bold">9,59 €</td>
                </tr>
                <tr>
                  <td className="border border-[#e4dac9] p-3 font-bold">3 parfums ou plus (ou dès 100 €)</td>
                  <td className="border border-[#e4dac9] p-3">Colissimo Domicile suivi</td>
                  <td className="border border-[#e4dac9] p-3 font-extrabold text-[#46a74e]">OFFERT (0,00 €)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
            <li>
              <strong>Préparation :</strong> Les commandes sont préparées les jours ouvrés (du lundi au vendredi, hors jours fériés).
            </li>
            <li>
              <strong>Suivi de colis :</strong> Dès l&apos;expédition, vous recevez votre lien de suivi par e-mail et pouvez également consulter la page{' '}
              <Link href="/suivi-commande" className="text-[#d4a017] font-semibold underline">
                Suivi de commande
              </Link>.
            </li>
          </ul>
        </section>

        {/* Section Retours */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#e4dac9] pb-2">
            <RotateCcw className="h-5 w-5 text-[#d4a017]" />
            <h2 className="text-lg font-headline font-bold">2. Droit de Rétractation &amp; Retours (14 jours)</h2>
          </div>

          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Délai :</strong> Vous disposez d&apos;un délai de <strong>14 jours calendaires</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation.
            </li>
            <li>
              <strong>Conditions d&apos;acceptation :</strong> Pour des raisons d&apos;hygiène et de protection des fragrances, le flacon retourné doit être <strong>dans son état d&apos;origine, neuf, non ouvert et scellé sous son film plastique d&apos;origine (blister intact)</strong>.
            </li>
            <li>
              <strong>Procédure :</strong> Contactez notre service client via la{' '}
              <Link href="/contact" className="text-[#d4a017] font-semibold underline">
                page Contact
              </Link>{' '}
              ou par e-mail à <a href="mailto:contact@dubainegoce.fr" className="font-semibold underline">contact@dubainegoce.fr</a> en indiquant votre numéro de commande.
            </li>
            <li>
              <strong>Frais de retour &amp; Remboursement :</strong> Les frais de retour sont à la charge de l&apos;acheteur. Le remboursement est effectué sur le moyen de paiement initial après réception et vérification de l&apos;état du produit.
            </li>
          </ul>
        </section>

        {/* Contact direct */}
        <div className="bg-[#f7f0e6] border border-[#e4dac9] rounded p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-[#d4a017] shrink-0" />
            <span>Une question sur votre livraison ? Notre équipe vous accompagne en français :</span>
          </div>
          <div className="flex flex-wrap gap-4 font-bold">
            <a href="tel:+33758999726" className="inline-flex items-center gap-1.5 hover:text-[#d4a017]">
              <Phone className="h-4 w-4 text-[#d4a017]" /> +33 7 58 99 97 26
            </a>
            <a href="mailto:contact@dubainegoce.fr" className="inline-flex items-center gap-1.5 hover:text-[#d4a017]">
              <Mail className="h-4 w-4 text-[#d4a017]" /> contact@dubainegoce.fr
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
