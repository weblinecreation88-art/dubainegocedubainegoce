
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Expédition et Retours',
    description: 'Informations sur notre politique d\'expédition et de retour. Livraison rapide en 48h et retours sous 14 jours.',
};

export default function ShippingPolicyPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
                <h1>Politique d'Expédition et de Retour</h1>
                
                <h2>Expédition</h2>
                <p>
                    Chez DubaiNegoce, nous nous efforçons de traiter et d'expédier votre commande dans les plus brefs délais.
                </p>
                <ul>
                    <li>
                        <strong>Préparation :</strong> Votre commande est préparée et expédiée sous 48 heures (jours ouvrés).
                    </li>
                    <li>
                        <strong>Transporteurs :</strong> Nous proposons deux options de livraison :
                        <ul>
                            <li><strong>Mondial Relay :</strong> Livraison en point relais (3-5 jours ouvrés). Cette option est gratuite.</li>
                            <li><strong>Colissimo :</strong> Livraison à domicile (2-3 jours ouvrés). Cette option est facturée 5,90€.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Suivi :</strong> Un numéro de suivi vous est envoyé par e-mail dès l'expédition de votre colis, vous permettant de suivre son parcours en temps réel.
                    </li>
                </ul>

                <h2>Politique de Retour</h2>
                <p>
                    Votre satisfaction est notre priorité. Si un produit ne vous convient pas, vous pouvez nous le retourner.
                </p>
                <ul>
                    <li>
                        <strong>Délai de rétractation :</strong> Vous disposez d'un délai de 14 jours calendaires à compter de la réception de votre commande pour exercer votre droit de rétractation.
                    </li>
                    <li>
                        <strong>Conditions de retour :</strong> Pour être accepté, le produit retourné doit être dans son état d'origine, neuf, non utilisé et encore sous son emballage plastique (blister). Tout produit ouvert, endommagé ou dont l'emballage d'origine serait détérioré ne sera ni remboursé ni échangé.
                    </li>
                    <li>
                        <strong>Procédure de retour :</strong> Pour initier un retour, veuillez nous contacter via notre <a href="/contact">page de contact</a> en précisant votre numéro de commande et le produit concerné. Nous vous fournirons alors les instructions pour le retour.
                    </li>
                    <li>
                        <strong>Frais de retour :</strong> Les frais de port liés au retour du produit sont à votre charge.
                    </li>
                    <li>
                        <strong>Remboursement :</strong> Une fois le retour reçu et inspecté, nous vous enverrons un e-mail pour vous informer de l'approbation ou du rejet de votre remboursement. S'il est approuvé, votre remboursement sera traité et un crédit sera automatiquement appliqué à votre méthode de paiement originale dans un délai de quelques jours.
                    </li>
                </ul>
            </div>
        </div>
    );
}
