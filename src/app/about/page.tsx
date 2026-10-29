import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Tag,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Qui sommes-nous ? | Dubaï Négoce — Parfums Authentiques de Dubaï',
  description:
    'Découvrez Dubaï Négoce, boutique française spécialisée dans les eaux de parfum authentiques de Dubaï (Lattafa, Maison Alhambra, French Avenue, Fragrance World, Paris Corner) au tarif unique de 35,00 € TTC.',
  alternates: { canonical: 'https://dubainegoce.fr/about' },
};

const MAISONS = [
  {
    name: 'Lattafa Perfumes',
    description: 'Référence mondiale de la parfumerie émiratie (Khamrah, Yara, Asad, Badee Al Oud).',
    href: '/shop/marque/lattafa',
  },
  {
    name: 'Maison Alhambra',
    description: 'Créations contemporaines à forte concentration et tenue longue durée.',
    href: '/shop/marque/maison-alhambra',
  },
  {
    name: 'French Avenue',
    description: 'Sillages sophistiqués alliant savoir-faire français et richesse orientale.',
    href: '/shop/marque/french-avenue',
  },
  {
    name: 'Fragrance World',
    description: 'Compositions audacieuses aux accords boisés, ambrés, floraux et gourmands.',
    href: '/shop/marque/fragrance-world',
  },
  {
    name: 'Paris Corner',
    description: 'Collections orientales et gourmandes prisées des amateurs de parfums de niche.',
    href: '/shop/marque/paris-corner',
  },
  {
    name: 'Ard Al Zaafaran',
    description: 'Tradition orientale authentique autour du oud, du musc, de la rose et du safran.',
    href: '/shop/marque/ard-al-zaafaran',
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Fil d'Ariane */}
      <nav
        aria-label="Fil d'Ariane"
        className="mb-6 text-xs text-gray-600 bg-white border border-[#e4dac9] rounded px-3.5 py-2"
      >
        <Link href="/" className="hover:text-[#d4a017]">
          Accueil
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-bold text-[#111827]">Qui sommes-nous ?</span>
      </nav>

      <div className="bg-white border border-[#e4dac9] rounded p-6 sm:p-8 space-y-10 text-[#111827] shadow-sm">
        {/* En-tête de la page */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#111827] text-white rounded border border-[#d4a017]/40 overflow-hidden">
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-3">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-[#111827] bg-[#d4a017] font-extrabold px-2.5 py-1 rounded-[2px]">
              Notre Boutique
            </span>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold leading-tight">
              Dubaï Négoce •{' '}
              <span className="text-[#d4a017]">Votre Escale Olfactive à Dubaï</span>
            </h1>
            <p className="text-sm text-white/85 leading-relaxed">
              Bienvenue chez <strong>Dubaï Négoce</strong>, boutique spécialisée dans la sélection d&apos;eaux de parfum authentiques importées des grandes maisons de parfumerie de Dubaï. Notre engagement est clair : rendre l&apos;excellence de la parfumerie orientale accessible au{' '}
              <strong className="text-[#d4a017]">prix unique et transparent de 35,00 € TTC</strong>.
            </p>
          </div>

          <div className="lg:col-span-5 relative h-[220px] sm:h-[260px] bg-[#fdfaf4] border-t lg:border-t-0 lg:border-l border-[#d4a017]/40">
            <Image
              src="/images/hero/hero-khamrah.jpg"
              alt="Sélection d'eaux de parfum authentiques chez Dubaï Négoce"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* 1. Notre Histoire & L'Authenticité */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#fdfaf4] border border-[#e4dac9] rounded p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2.5 border-b border-[#e4dac9] pb-2.5">
              <Sparkles className="h-5 w-5 text-[#d4a017] shrink-0" />
              <h2 className="text-lg font-headline font-bold">Notre Passion pour les Parfums de Dubaï</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Dubaï Négoce</strong> est née d&apos;une véritable passion pour les créations olfactives du Moyen-Orient : des sillages généreux, des matières premières nobles (oud, ambre, vanille, safran, rose de Damas, bois précieux) et une tenue remarquable sur la peau.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Nous sélectionnons chaque référence pour son caractère, son équilibre et la qualité de sa concentration en eau de parfum, afin de vous proposer un catalogue lisible et exigeant.
            </p>
          </div>

          <div className="bg-[#fdfaf4] border border-[#e4dac9] rounded p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2.5 border-b border-[#e4dac9] pb-2.5">
              <ShieldCheck className="h-5 w-5 text-[#d4a017] shrink-0" />
              <h2 className="text-lg font-headline font-bold">L&apos;Authenticité Garantie</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Tous les parfums vendus sur <strong>dubainegoce.fr</strong> sont{' '}
              <strong>100 % authentiques</strong> et proviennent des circuits de distribution officiels des maisons émiraties.
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#46a74e] shrink-0" />
                <span>Flacons d&apos;origine neufs, scellés sous film plastique (blister intact)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#46a74e] shrink-0" />
                <span>Boîtes officielles avec hologramme de sécurité des marques</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#46a74e] shrink-0" />
                <span>Stock réel expédié depuis la France avec suivi Colissimo</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Nos 3 Engagements Clairs */}
        <section className="space-y-4">
          <div className="border-b border-[#e4dac9] pb-2.5">
            <h2 className="text-xl font-headline font-bold">Nos Engagements Client</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Des conditions commerciales simples, transparentes et identiques sur tout le site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#fdfaf4] border border-[#e4dac9] rounded p-5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#111827] text-[#d4a017] w-9 h-9 rounded flex items-center justify-center shrink-0">
                  <Tag className="h-4 w-4" />
                </div>
                <h3 className="font-headline font-bold text-base">Prix Unique 35,00 € TTC</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                L&apos;ensemble de notre catalogue de parfums est proposé au tarif fixe de{' '}
                <strong>35,00 € TTC</strong> le flacon, sans faux prix barrés ni frais cachés.
              </p>
            </div>

            <div className="bg-[#fdfaf4] border border-[#e4dac9] rounded p-5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#111827] text-[#d4a017] w-9 h-9 rounded flex items-center justify-center shrink-0">
                  <Truck className="h-4 w-4" />
                </div>
                <h3 className="font-headline font-bold text-base">Expédition Colissimo Suivie</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Livraison à domicile en <strong>Colissimo 48h avec suivi</strong> (7,10 € pour 1 parfum, 9,59 € pour 2 parfums, et{' '}
                <strong className="text-[#46a74e]">100 % OFFERTE dès 3 parfums</strong>).
              </p>
            </div>

            <div className="bg-[#fdfaf4] border border-[#e4dac9] rounded p-5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#111827] text-[#d4a017] w-9 h-9 rounded flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4" />
                </div>
                <h3 className="font-headline font-bold text-base">Retours sous 14 Jours</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Vous bénéficiez d&apos;un droit de rétractation de <strong>14 jours</strong> à réception pour tout flacon neuf non ouvert dans son blister d&apos;origine.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Les Maisons distribuées */}
        <section className="space-y-4">
          <div className="border-b border-[#e4dac9] pb-2.5">
            <h2 className="text-xl font-headline font-bold">Les Grandes Maisons de Dubaï Sélectionnées</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MAISONS.map((maison) => (
              <Link
                key={maison.name}
                href={maison.href}
                className="group bg-white border border-[#e4dac9] hover:border-[#d4a017] rounded p-4 transition-colors flex flex-col justify-between gap-2"
              >
                <div>
                  <h3 className="font-headline font-bold text-sm text-[#111827] group-hover:text-[#d4a017]">
                    {maison.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{maison.description}</p>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4a017] inline-flex items-center gap-1">
                  Voir les parfums <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Bandeau Contact & Découverte */}
        <div className="bg-[#f7f0e6] border border-[#e4dac9] rounded p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <h2 className="text-lg font-headline font-bold text-[#111827]">
              Besoin d&apos;un conseil pour choisir votre parfum ?
            </h2>
            <p className="text-xs sm:text-sm text-gray-700">
              Notre service client vous répond en français par téléphone et par e-mail :
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs sm:text-sm font-bold">
              <a href="tel:+33758999726" className="inline-flex items-center gap-1.5 hover:text-[#d4a017]">
                <Phone className="h-4 w-4 text-[#d4a017]" /> +33 7 58 99 97 26
              </a>
              <a href="mailto:contact@dubainegoce.fr" className="inline-flex items-center gap-1.5 hover:text-[#d4a017]">
                <Mail className="h-4 w-4 text-[#d4a017]" /> contact@dubainegoce.fr
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Button
              asChild
              className="bg-[#111827] text-white hover:bg-[#d4a017] hover:text-[#111827] rounded-[2px] px-5 h-10 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Link href="/shop/all">Explorer le catalogue (35 €)</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-[2px] px-5 h-10 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Link href="/trouver-mon-parfum">Diagnostic parfum</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
