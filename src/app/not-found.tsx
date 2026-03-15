'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-6xl font-serif text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-2">Cette page n&apos;existe pas.</p>
      <p className="text-sm text-gray-400 mb-8">Redirection vers l&apos;accueil dans 3 secondes…</p>
      <Link
        href="/"
        className="bg-black text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
