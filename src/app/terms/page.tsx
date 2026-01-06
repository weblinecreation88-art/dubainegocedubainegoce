
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Conditions Générales de Vente',
    description: 'Consultez les conditions générales de vente de DubaiNegoce.',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
                <h1>Conditions Générales de Vente</h1>
                <p className="text-muted-foreground">Dernière mise à jour : 8 Décembre 2025</p>

                <h2>Article 1 : Objet</h2>
                <p>
                    Les présentes conditions régissent les ventes par la société DubaiNegoce de parfums orientaux.
                </p>

                <h2>Article 2 : Prix</h2>
                <p>
                    Les prix de nos produits sont indiqués en euros toutes taxes comprises (TVA et autres taxes applicables au jour de la commande), sauf indication contraire et hors frais de traitement et d'expédition.
                    Toutes les commandes quelle que soit leur origine sont payables en euros.
                    La société DubaiNegoce se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande et sous réserve de disponibilité.
                </p>

                <h2>Article 3 : Commandes</h2>
                <p>
                    Vous pouvez passer commande sur notre site internet www.dubainegoce.fr. Les informations contractuelles sont présentées en langue française et feront l'objet d'une confirmation au plus tard au moment de la validation de votre commande.
                </p>

                <h2>Article 4 : Validation de votre commande</h2>
                <p>
                    Toute commande figurant sur le site Internet www.dubainegoce.fr suppose l'adhésion aux présentes Conditions Générales. Toute confirmation de commande entraîne votre adhésion pleine et entière aux présentes conditions générales de vente, sans exception ni réserve.
                </p>

                <h2>Article 5 : Paiement</h2>
                <p>
                    Le fait de valider votre commande implique pour vous l'obligation de payer le prix indiqué. Le règlement de vos achats s'effectue par carte bancaire grâce au système sécurisé Stripe.
                </p>

                <h2>Article 6 : Rétractation et Retours</h2>
                <p>
                    Conformément aux dispositions de l'article L.121-21 du Code de la Consommation, vous disposez d'un délai de rétractation de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétraction sans avoir à justifier de motifs ni à payer de pénalité.
                </p>
                <p>
                    Les retours sont à effectuer dans leur état d'origine et complets (emballage, accessoires, notice). Dans ce cadre, votre responsabilité est engagée. Tout dommage subi par le produit à cette occasion peut être de nature à faire échec au droit de rétractation. Les produits ne doivent pas avoir été ouverts (blister intact).
                    Les frais de retour sont à votre charge.
                    Pour plus d'informations, veuillez consulter notre <a href="/shipping">Politique de Retour</a>.
                </p>
                
                <h2>Article 7 : Droit applicable en cas de litiges</h2>
                <p>
                    La langue du présent contrat est la langue française. Les présentes conditions de vente sont soumises à la loi française. En cas de litige, les tribunaux français seront les seuls compétents.
                </p>

                <h2>Article 8 : Propriété Intellectuelle</h2>
                <p>
                    Tous les éléments du site www.dubainegoce.fr sont et restent la propriété intellectuelle et exclusive de la société DubaiNegoce. Nul n'est autorisé à reproduire, exploiter, rediffuser, ou utiliser à quelque titre que ce soit, même partiellement, des éléments du site qu'ils soient logiciels, visuels ou sonores.
                </p>
            </div>
        </div>
    );
}
