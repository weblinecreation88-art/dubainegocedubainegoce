import Link from 'next/link';

interface CustomerReviewsProps {
  productName: string;
  limit?: number;
  trustpilotUrl?: string;
}

export function CustomerReviews(_props: CustomerReviewsProps) {
  return (
    <div className="py-6">
      <h3 className="font-headline text-lg font-bold">Avis sur la boutique</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Consultez les expériences clients sur Trustpilot. Ces avis concernent la boutique et ne constituent pas une note de ce parfum.</p>
      <Link href="https://fr.trustpilot.com/review/dubainegoce.fr" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center underline underline-offset-4">Lire les avis sur Trustpilot</Link>
    </div>
  );
}
