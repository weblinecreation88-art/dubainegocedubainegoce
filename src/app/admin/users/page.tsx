'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/server';
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  orderCount: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData: User[] = [];

        // Fetch orders to match users
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const userOrdersMap = new Map<
          string,
          { count: number; total: number }
        >();

        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          const userId = order.userId;
          const current = userOrdersMap.get(userId) || { count: 0, total: 0 };
          current.count++;
          current.total += order.total || 0;
          userOrdersMap.set(userId, current);
        });

        // Build user list
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          const orders = userOrdersMap.get(doc.id) || { count: 0, total: 0 };

          usersData.push({
            id: doc.id,
            email: userData.email || 'N/A',
            displayName: userData.displayName,
            createdAt: userData.createdAt?.toDate?.() || new Date(),
            orderCount: orders.count,
            totalSpent: orders.total,
          });
        });

        // Sort by creation date (newest first)
        usersData.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const stats = {
    total: users.length,
    activeUsers: users.filter((u) => u.orderCount > 0).length,
    newUsers: users.filter(
      (u) =>
        u.createdAt >
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
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Utilisateurs</h1>
        <p className="text-muted-foreground">
          Gestion des utilisateurs et clients
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Utilisateurs"
          value={stats.total.toString()}
          color="bg-blue-500"
        />
        <StatCard
          label="Utilisateurs Actifs"
          value={stats.activeUsers.toString()}
          color="bg-green-500"
        />
        <StatCard
          label="Nouveaux (30j)"
          value={stats.newUsers.toString()}
          color="bg-purple-500"
        />
        <StatCard
          label="Revenu Total"
          value={`${stats.totalRevenue.toLocaleString('fr-FR')} €`}
          color="bg-orange-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Nom
              </th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">
                Commandes
              </th>
              <th className="px-6 py-4 text-right font-semibold text-foreground">
                Dépenses
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Date d'Inscription
              </th>
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
                    <span className="font-medium text-foreground">
                      {user.orderCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-foreground">
                      {user.totalSpent.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {format(user.createdAt, 'dd MMM yyyy', { locale: fr })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="text-muted-foreground">
                    Aucun utilisateur trouvé
                  </p>
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
