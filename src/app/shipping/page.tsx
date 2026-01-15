
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Expédition et Retours',
    description: 'Informations sur notre politique d\'expédition et de retour. Livraison Mondial Relay dès 5,10€ et retours sous 14 jours.',
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
                        <strong>Transporteur :</strong> Nous proposons la livraison via <strong>Mondial Relay</strong> en point relais (3-5 jours ouvrés).
                    </li>
                </ul>

                <h2>Tarifs de Livraison Mondial Relay</h2>
                <p>
                    Les frais de livraison sont calculés en fonction du poids de votre commande :
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-[#c58a3d]/30">
                        <thead>
                            <tr className="bg-[#c58a3d]/10">
                                <th className="border border-[#c58a3d]/30 px-4 py-3 text-left">Poids du colis</th>
                                <th className="border border-[#c58a3d]/30 px-4 py-3 text-left">Tarif Mondial Relay</th>
                                <th className="border border-[#c58a3d]/30 px-4 py-3 text-left">Délai</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 0,25 kg</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold">4,10€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                            <tr className="bg-muted/20">
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 0,5 kg</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold">4,10€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                            <tr>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 0,75 kg <span className="text-[#c58a3d] text-sm">(1 parfum)</span></td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold text-[#c58a3d]">5,10€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                            <tr className="bg-muted/20">
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 1 kg</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold">5,10€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                            <tr>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 2 kg <span className="text-[#c58a3d] text-sm">(2-3 parfums)</span></td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold">6,60€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                            <tr className="bg-muted/20">
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 4 kg <span className="text-[#c58a3d] text-sm">(4-5 parfums)</span></td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold">7,99€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                            <tr>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 5 kg</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold">15,99€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                            <tr className="bg-muted/20">
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 7 kg</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold">15,99€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                            <tr>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">Jusqu'à 10 kg</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2 font-semibold">15,99€</td>
                                <td className="border border-[#c58a3d]/30 px-4 py-2">3-5 jours ouvrés</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                    <strong>Note :</strong> Un parfum pèse environ 500-750g avec son emballage. Le tarif de livraison est calculé automatiquement au moment du paiement en fonction du poids total de votre commande.
                </p>

                <h2>Suivi de commande</h2>
                <p>
                    Un numéro de suivi vous est envoyé par e-mail dès l'expédition de votre colis, vous permettant de suivre son parcours en temps réel.
                </p>

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
