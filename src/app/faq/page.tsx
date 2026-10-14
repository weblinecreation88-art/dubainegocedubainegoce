import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
    title: 'Foire Aux Questions (FAQ) — Parfums de Dubaï | Dubainegoce',
    description: 'Trouvez les réponses à vos questions les plus fréquentes sur l\'authenticité, la livraison, la tenue de nos parfums et nos services.',
    alternates: {
        canonical: 'https://dubainegoce.fr/faq',
    },
    openGraph: {
        title: 'Foire Aux Questions (FAQ) — Dubainegoce',
        description: 'Toutes les réponses sur nos parfums de Dubaï authentiques.',
        url: 'https://dubainegoce.fr/faq',
        type: 'website',
    },
};

const faqItems = [
    {
        question: "Vos parfums sont-ils authentiques ?",
        answer: "Oui, absolument. Nous nous approvisionnons directement auprès des distributeurs officiels à Dubaï pour garantir que chaque parfum que nous vendons est 100% authentique. La confiance et la transparence sont nos priorités."
    },
    {
        question: "Pourquoi les parfums orientaux de Dubaï ont-ils une si bonne tenue ?",
        answer: "Les parfums de Dubaï sont formulés sous forme d'Eaux de Parfum (EDP) avec une forte concentration en essences pures (oud, ambre, musc, résines précieuses). Ces matières premières nobles s'évaporent très lentement et offrent une excellente tenue de 8 à 12 heures sur la peau."
    },
    {
        question: "Pourquoi vos prix sont-ils fixés à 35€ ?",
        answer: "Nous croyons que le luxe doit être accessible. En important en grande quantité et en optimisant nos coûts, nous sommes en mesure de proposer un prix juste et fixe sur une large sélection de nos parfums. Cela vous permet de découvrir de nouvelles fragrances sans vous ruiner."
    },
    {
        question: "Quels sont les délais de livraison ?",
        answer: "Nous expédions nos commandes en 48h via Colissimo et Mondial Relay. Une fois expédiée, votre commande arrive généralement sous 2 à 3 jours ouvrés en France métropolitaine."
    },
    {
        question: "Proposez-vous des retours ?",
        answer: "Oui, vous disposez d'un délai de 14 jours après réception pour nous retourner un produit, à condition qu'il soit encore sous blister et n'ait pas été utilisé. Consultez notre politique de retour pour plus de détails."
    },
    {
        question: "Comment puis-je suivre ma commande ?",
        answer: "Dès que votre commande est expédiée, vous recevrez un email contenant votre numéro de suivi Colissimo ou Mondial Relay. Vous pourrez ainsi suivre l'acheminement de votre colis en temps réel."
    }
];

export default function FaqPage() {
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: 'https://dubainegoce.fr',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'FAQ',
                item: 'https://dubainegoce.fr/faq',
            },
        ],
    };

    return (
        <div className="container mx-auto max-w-3xl px-4 py-12">
            <JsonLd data={faqJsonLd} />
            <JsonLd data={breadcrumbJsonLd} />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-bold">Foire Aux Questions</h1>
                <p className="text-muted-foreground mt-2">Les réponses à vos interrogations les plus courantes.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
                        <AccordionContent>
                           <p className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">{item.answer}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
