import Link from 'next/link';
import { ArrowRight, Search, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4 py-20">

      {/* Code 404 */}
      <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">Erreur 404</p>
      <h1 className="text-5xl font-serif text-gray-900 mb-4">Page introuvable</h1>
      <p className="text-base text-gray-500 max-w-md mb-10">
        Cette page n&apos;existe plus ou a été déplacée. Explorez notre boutique pour trouver votre parfum idéal.
      </p>

      {/* CTA principaux */}
      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <Link
          href="/shop"
          className="flex items-center gap-2 bg-black text-white px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Voir tous les parfums
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-gray-50 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>

      {/* Raccourcis catégories */}
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">Nos collections</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Parfums Lattafa', href: '/shop/marque/lattafa' },
            { label: 'Maison Alhambra', href: '/shop/marque/maison-alhambra' },
            { label: 'Pour Elle', href: '/shop/genre/femme' },
            { label: 'Pour Lui', href: '/shop/genre/homme' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-4 py-3 border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              {label}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
