'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, MapPin, User, LogOut } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
  { href: '/account', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'Mes Commandes', icon: Package, exact: false },
  { href: '/account/addresses', label: 'Mes Adresses', icon: MapPin, exact: false },
  { href: '/account/profile', label: 'Informations du compte', icon: User, exact: false },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { clearCart } = useCart();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/account');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      clearCart();
      router.push('/');
    }
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="h-9 w-48 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64"><Skeleton className="h-64 w-full rounded-lg" /></aside>
          <main className="flex-1"><Skeleton className="h-96 w-full rounded-lg" /></main>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-headline mb-8">Mon Compte</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="border border-gray-200 rounded-lg overflow-hidden">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-200 last:border-b-0 transition-colors',
                    isActive
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              Déconnexion
            </button>
          </nav>
        </aside>

        {/* Contenu */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
