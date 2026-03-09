'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BarChart3, LogOut, Menu, X } from 'lucide-react';

const ADMIN_EMAIL = 'weblinecreation88@gmail.com';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        router.push('/admin/login');
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setIsAuthorized(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-accent text-accent-foreground transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-accent-foreground/20 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg">DubaiNegoce</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-accent-foreground/10 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <AdminNavLink
            href="/admin"
            label="Tableau de bord"
            icon="📊"
            sidebarOpen={sidebarOpen}
          />
          <AdminNavLink
            href="/admin/analytics"
            label="Analytique"
            icon="📈"
            sidebarOpen={sidebarOpen}
          />
          <AdminNavLink
            href="/admin/products"
            label="Produits"
            icon="🛍️"
            sidebarOpen={sidebarOpen}
          />
          <AdminNavLink
            href="/admin/orders"
            label="Commandes"
            icon="📦"
            sidebarOpen={sidebarOpen}
          />
          <AdminNavLink
            href="/admin/users"
            label="Utilisateurs"
            icon="👥"
            sidebarOpen={sidebarOpen}
          />
          <AdminNavLink
            href="/admin/emails"
            label="Emails"
            icon="✉️"
            sidebarOpen={sidebarOpen}
          />
          <AdminNavLink
            href="/admin/settings"
            label="Paramètres"
            icon="⚙️"
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-accent-foreground/20">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent-foreground/10 transition-colors text-sm"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
          {sidebarOpen && (
            <p className="text-xs mt-3 text-accent-foreground/70 truncate">
              {user?.email}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-background border-b border-border px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.displayName || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface AdminNavLinkProps {
  href: string;
  label: string;
  icon: string;
  sidebarOpen: boolean;
}

function AdminNavLink({ href, label, icon, sidebarOpen }: AdminNavLinkProps) {
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isActive = pathname === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-accent-foreground/20 text-accent-foreground font-semibold'
          : 'text-accent-foreground/80 hover:bg-accent-foreground/10'
      }`}
      title={label}
    >
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span className="text-sm">{label}</span>}
    </button>
  );
}
