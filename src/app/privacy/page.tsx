
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politique de Confidentialité',
    description: 'Consultez notre politique de confidentialité pour comprendre comment nous collectons, utilisons et protégeons vos données personnelles.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
                <h1>Politique de Confidentialité</h1>
                <p className="text-muted-foreground">Dernière mise à jour : 8 Décembre 2025</p>

                <p>
                    DubaiNegoce ("nous", "notre") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web.
                </p>

                <h2>Collecte de vos informations</h2>
                <p>
                    Nous pouvons collecter des informations vous concernant de différentes manières. Les informations que nous pouvons collecter sur le Site incluent :
                </p>
                <ul>
                    <li>
                        <strong>Données personnelles :</strong> Des informations d'identification personnelle, telles que votre nom, votre adresse de livraison, votre adresse e-mail et votre numéro de téléphone, que vous nous fournissez volontairement lorsque vous passez une commande ou que vous vous inscrivez à notre newsletter.
                    </li>
                    <li>
                        <strong>Données de navigation :</strong> Des informations que votre navigateur envoie automatiquement lorsque vous visitez le site, comme votre adresse IP, votre type de navigateur, les temps d'accès et les pages que vous avez consultées.
                    </li>
                     <li>
                        <strong>Données de panier :</strong> Pour améliorer votre expérience, nous utilisons le stockage local de votre navigateur pour sauvegarder le contenu de votre panier d'achat entre les sessions. Ces informations sont stockées uniquement sur votre appareil et ne sont pas transmises à nos serveurs avant la finalisation de la commande.
                    </li>
                </ul>

                <h2>Utilisation de vos informations</h2>
                <p>
                    Avoir des informations précises nous permet de vous offrir une expérience fluide, efficace et personnalisée. Spécifiquement, nous pouvons utiliser les informations collectées à votre sujet via le Site pour :
                </p>
                <ul>
                    <li>Gérer les commandes, les paiements et autres transactions.</li>
                    <li>Vous envoyer une newsletter ou d'autres communications marketing.</li>
                    <li>Améliorer l'efficacité et le fonctionnement du Site.</li>
                    <li>Vous informer des mises à jour du Site.</li>
                    <li>Prévenir les activités frauduleuses.</li>
                </ul>

                <h2>Sécurité de vos informations</h2>
                <p>
                    Nous utilisons des mesures de sécurité administratives, techniques et physiques pour aider à protéger vos informations personnelles. Bien que nous ayons pris des mesures raisonnables pour sécuriser les informations personnelles que vous nous fournissez, veuillez être conscient que malgré nos efforts, aucune mesure de sécurité n'est parfaite ou impénétrable.
                </p>
                
                <h2>Politique concernant les cookies</h2>
                <p>
                    Nous pouvons utiliser des cookies et d'autres technologies de suivi sur le Site pour aider à personnaliser le Site et améliorer votre expérience. Lors de votre première visite, il vous sera demandé d'accepter ou de refuser l'utilisation de cookies non essentiels.
                </p>

                <h2>Vos droits</h2>
                <p>
                    Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Vous pouvez exercer ces droits en nous contactant via notre page de contact.
                </p>

                <h2>Contact</h2>
                <p>
                    Si vous avez des questions ou des commentaires sur cette Politique de Confidentialité, veuillez nous contacter via le formulaire disponible sur notre page <a href="/contact">Contact</a>.
                </p>
            </div>
        </div>
    );
}
