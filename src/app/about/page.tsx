
import { Metadata } from 'next';
import { Award, Gem, Rocket, ShieldCheck, Heart, Phone, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'À propos de DubaïNégoce | Votre Escale Olfactive à Dubaï',
    description: 'DubaïNégoce : parfums orientaux 100% authentiques importés directement de Dubaï. Prix unique 35 €, livraison 48h Colissimo ou Mondial Relay.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20 space-y-20">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
                    <h1 className="text-4xl md:text-5xl leading-tight">
                        Votre Escale&nbsp;Olfactive à&nbsp;Dubaï
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Bienvenue chez <strong className="text-foreground">DubaïNégoce</strong>, votre destination privilégiée pour explorer l'univers envoûtant des parfums de Dubaï. Notre mission est simple : vous offrir le luxe et le raffinement de la parfumerie orientale à un <strong className="text-primary">prix fixe et imbattable de 35 €</strong> pour l'ensemble de notre sélection.
                    </p>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
                    <video
                        src="https://res.cloudinary.com/dzntnjtkc/video/upload/v1766756778/grok-video-cb2fca02-2ae9-4b89-a5b2-12da1496b756_1_wadkqm.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* ── Notre Histoire ───────────────────────────────────────── */}
            <section className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-headline text-2xl md:text-3xl text-primary">Notre Histoire et Notre Passion</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        DubaïNégoce est née d'une passion pour les fragrances uniques et captivantes du Moyen-Orient. Nous avons été séduits par la richesse des ingrédients, la complexité des compositions et l'élégance des flacons qui caractérisent la parfumerie de Dubaï.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        C'est pourquoi nous avons décidé de créer une plateforme où vous pouvez découvrir ces trésors olfactifs, sans compromis sur la qualité ni sur votre budget.
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-headline text-2xl md:text-3xl text-primary">L'Authenticité avant Tout</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        Nous comprenons l'importance de l'authenticité lorsqu'il s'agit de parfum. C'est pourquoi nous nous engageons à vous proposer uniquement des produits <strong className="text-foreground">100% authentiques, importés directement de Dubaï</strong>.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        Notre équipe sélectionne avec soin chaque fragrance pour garantir sa qualité. Vous trouverez chez nous des marques de renom telles que <strong className="text-foreground">Maison Alhambra, Lattafa, Fragrance World</strong> et bien d'autres, connues pour leur savoir-faire et leur créativité.
                    </p>
                </div>
            </section>

            {/* ── Nos engagements (3 blocs) ────────────────────────────── */}
            <section>
                <h2 className="font-headline text-3xl text-center text-primary mb-10">Nos Engagements</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
                        <div className="p-3 bg-primary/10 rounded-full w-fit">
                            <Gem className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-headline text-lg text-foreground">Le Luxe Accessible</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Tous nos parfums sont proposés à <strong className="text-primary">35 €</strong>. Pas de surprises, pas de coûts cachés. Juste le plaisir de découvrir des fragrances luxueuses à un prix juste et transparent.
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
                        <div className="p-3 bg-primary/10 rounded-full w-fit">
                            <Rocket className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-headline text-lg text-foreground">Rapidité et Fiabilité</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Livraison en <strong className="text-foreground">48h</strong> via <strong className="text-foreground">Colissimo</strong> à domicile ou <strong className="text-foreground">Mondial Relay</strong> en point relais. Chaque commande est préparée avec soin pour vous parvenir en parfait état.
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
                        <div className="p-3 bg-primary/10 rounded-full w-fit">
                            <Star className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-headline text-lg text-foreground">Conseils d'Experts</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Que vous soyez amateur ou collectionneur, notre équipe vous guide avec passion. Boisé, floral, épicé, sucré… vous trouverez forcément votre bonheur chez DubaïNégoce.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Contact & CTA ────────────────────────────────────────── */}
            <section className="bg-card border border-primary/20 rounded-2xl p-8 md:p-12 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Phone className="h-7 w-7 text-primary" />
                    </div>
                </div>
                <h2 className="font-headline text-2xl md:text-3xl text-primary">Rejoignez l'Aventure DubaïNégoce</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Explorez notre collection et laissez-vous transporter par les senteurs magiques de Dubaï. Si vous avez la moindre question, notre équipe est à votre disposition par téléphone.
                </p>
                <a
                    href="tel:+33758999726"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                    <Phone className="h-4 w-4" />
                    +33 7 58 99 97 26
                </a>
                <p className="text-sm text-muted-foreground">Merci de votre confiance et bonne découverte !</p>
            </section>

        </div>
    );
}
