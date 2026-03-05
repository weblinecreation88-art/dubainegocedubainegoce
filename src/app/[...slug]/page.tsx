import { redirect } from 'next/navigation';

type Props = {
  params: { slug: string[] };
};

export default function CatchAllPage({ params }: Props) {
  const path = '/' + params.slug.join('/');

  // Rediriger les anciennes routes WordPress vers les nouvelles routes Next.js
  // IMPORTANT: L'ordre des règles est important - les plus spécifiques d'abord

  // Genres spécifiques (avant /genre générique)
  if (path.startsWith('/genre/femme')) redirect('/shop/genre/femme');
  if (path.startsWith('/genre/homme')) redirect('/shop/genre/homme');
  if (path.startsWith('/genre/unisex')) redirect('/shop/genre/mixte');

  // Catégories WordPress → Shop Next.js
  if (path.startsWith('/categorie-produit')) redirect('/shop');

  // Genres génériques
  if (path.startsWith('/genre')) redirect('/shop');

  // Produits individuels → Shop (pas vers /parfum/ qui peut ne pas exister)
  if (path.startsWith('/produit')) redirect('/shop');

  // Fallback pour toute autre route inconnue
  redirect('/shop');
}
