import type { ReactNode } from 'react';

// useSearchParams in interactive filters must render against the request on the
// server. Static prerendering otherwise sends only the Suspense fallback.
export const dynamic = 'force-dynamic';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return children;
}
