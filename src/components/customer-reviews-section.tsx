import Link from 'next/link';

/** No copied testimonials or unverified aggregate score. */
export function CustomerReviewsSection() {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="font-headline text-xl font-bold">Les avis de nos clients</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Retrouvez les expériences publiées sur le profil Trustpilot de Dubaï Négoce.</p>
      <Link href="https://fr.trustpilot.com/review/dubainegoce.fr" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4">Consulter les avis sur Trustpilot</Link>
    </section>
  );
}
