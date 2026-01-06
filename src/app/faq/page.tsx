
import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
    title: 'Foire Aux Questions (FAQ)',
    description: 'Trouvez les réponses à vos questions les plus fréquentes sur nos parfums, nos commandes et nos services.',
};

const faqItems = [
    {
        question: "Vos parfums sont-ils authentiques ?",
        answer: "Oui, absolument. Nous nous approvisionnons directement auprès des distributeurs officiels à Dubaï pour garantir que chaque parfum que nous vendons est 100% authentique. La confiance et la transparence sont nos priorités."
    },
    {
        question: "Qu'est-ce qu'un 'dupe' ?",
        answer: "Un 'dupe' est un parfum inspiré d'une fragrance de luxe très connue. Les maisons de parfum de Dubaï sont expertes dans la création de dupes de haute qualité qui capturent l'essence de l'original à une fraction du prix, souvent avec une performance (tenue et sillage) excellente."
    },
    {
        question: "Pourquoi vos prix sont-ils fixés à 35€ ?",
        answer: "Nous croyons que le luxe doit être accessible. En important en grande quantité et en optimisant nos coûts, nous sommes en mesure de proposer un prix juste et fixe sur une large sélection de nos parfums. Cela vous permet de découvrir de nouvelles fragrances sans vous ruiner."
    },
    {
        question: "Quels sont les délais de livraison ?",
        answer: "Nous expédions nos commandes en 48h via Colissimo. Une fois expédiée, votre commande arrive généralement sous 2 à 3 jours ouvrés en France métropolitaine."
    },
    {
        question: "Proposez-vous des retours ?",
        answer: "Oui, vous disposez d'un délai de 14 jours après réception pour nous retourner un produit, à condition qu'il soit encore sous blister et n'ait pas été utilisé. Consultez notre politique de retour pour plus de détails."
    },
    {
        question: "Comment puis-je suivre ma commande ?",
        answer: "Dès que votre commande est expédiée, vous recevrez un email contenant votre numéro de suivi Colissimo. Vous pourrez ainsi suivre l'acheminement de votre colis en temps réel sur le site de La Poste."
    }
];

export default function FaqPage() {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline">Foire Aux Questions</h1>
                <p className="text-muted-foreground mt-2">Les réponses à vos interrogations les plus courantes.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                        <AccordionContent>
                           <p className="prose prose-invert max-w-none">{item.answer}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
