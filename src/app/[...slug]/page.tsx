import { redirect } from 'next/navigation';

type Props = {
  params: { slug: string[] };
};

export default function CatchAllPage({ params }: Props) {
  const path = '/' + params.slug.join('/');

  // Rediriger les anciennes routes WordPress vers les nouvelles routes Next.js
  const redirectMap: Record<string, string> = {
    // Produits WordPress → Parfum Next.js
    '/produit': '/shop',

    // Catégories WordPress → Shop Next.js
    '/categorie-produit': '/shop',

    // Genre WordPress → Shop Genre Next.js
    '/genre/femme': '/shop/genre/femme',
    '/genre/homme': '/shop/genre/homme',
    '/genre/unisex': '/shop/genre/mixte',
    '/genre': '/shop',
  };

  // Trouver la redirection correspondante
  for (const [oldPath, newPath] of Object.entries(redirectMap)) {
    if (path.startsWith(oldPath)) {
      redirect(newPath);
    }
  }

  // Si aucune redirection ne correspond, aller à /shop (page par défaut)
  redirect('/shop');
}
