'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase';
import { adminFetch } from '@/lib/admin-fetch';

interface EmailLog {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  status: string;
  opened: boolean;
  clicked: boolean;
  sentAt: string;
}

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const auth = useAuth();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await adminFetch(auth, '/api/admin/emails');
        if (!response.ok) throw new Error('Failed to fetch emails');
        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [auth]);

  const filteredEmails =
    typeFilter === 'all'
      ? emails
      : emails.filter((email) => email.type === typeFilter);

  const stats = {
    total: emails.length,
    sent: emails.filter((e) => e.status === 'sent').length,
    opened: emails.filter((e) => e.opened).length,
    clicked: emails.filter((e) => e.clicked).length,
    failed: emails.filter((e) => e.status === 'failed').length,
    openRate: Math.round(
      (emails.filter((e) => e.opened).length / Math.max(emails.length, 1)) * 100
    ),
    clickRate: Math.round(
      (emails.filter((e) => e.clicked).length / Math.max(emails.length, 1)) * 100
    ),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Chargement des emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Emails</h1>
        <p className="text-muted-foreground">Suivi des campagnes et performances email</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Emails Envoyés" value={stats.total.toString()} color="bg-blue-500" />
        <StatCard label="Taux d'Ouverture" value={`${stats.openRate}%`} color="bg-green-500" />
        <StatCard label="Taux de Clic" value={`${stats.clickRate}%`} color="bg-purple-500" />
        <StatCard label="Échecs" value={stats.failed.toString()} color="bg-red-500" />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            typeFilter === 'all'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Tous ({stats.total})
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Type</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Destinataire</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Objet</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Statut</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Interactions</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Envoyé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <tr key={email.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-semibold">
                      {email.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">{email.recipient}</td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">{email.subject}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold capitalize">{email.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    <div className="flex items-center justify-center gap-2">
                      {email.opened && <span title="Ouvert">👁️</span>}
                      {email.clicked && <span title="Cliqué">🖱️</span>}
                      {!email.opened && !email.clicked && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(email.sentAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <p className="text-muted-foreground">Aucun email trouvé</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
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
