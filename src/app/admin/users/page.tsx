'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase';
import { adminFetch } from '@/lib/admin-fetch';

interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminFetch(auth, '/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [auth]);

  const stats = {
    total: users.length,
    activeUsers: users.filter((u) => u.orderCount > 0).length,
    newUsers: users.filter(
      (u) =>
        new Date(u.createdAt) >
        new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Utilisateurs</h1>
        <p className="text-muted-foreground">Gestion des utilisateurs et clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Utilisateurs" value={stats.total.toString()} color="bg-blue-500" />
        <StatCard label="Utilisateurs Actifs" value={stats.activeUsers.toString()} color="bg-green-500" />
        <StatCard label="Nouveaux (30j)" value={stats.newUsers.toString()} color="bg-purple-500" />
        <StatCard label="Revenu Total" value={`${stats.totalRevenue.toLocaleString('fr-FR')} €`} color="bg-orange-500" />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Nom</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Commandes</th>
              <th className="px-6 py-4 text-right font-semibold text-foreground">Dépenses</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Date d'Inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-foreground font-medium">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.displayName || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-foreground">{user.orderCount}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-foreground">
                      {user.totalSpent.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <div className={`w-8 h-8 rounded-lg ${color}`} />
      </div>
    </div>
  );
}
