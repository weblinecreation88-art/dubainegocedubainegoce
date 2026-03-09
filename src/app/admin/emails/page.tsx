'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailLog {
  id: string;
  type: string; // 'welcome', 'recovery', 'reminder', 'newsletter'
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'bounced';
  opened: boolean;
  clicked: boolean;
  sentAt: Date;
}

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const emailsSnapshot = await getDocs(collection(db, 'emailLogs'));
        const emailsData: EmailLog[] = [];

        emailsSnapshot.forEach((doc) => {
          const data = doc.data();
          emailsData.push({
            id: doc.id,
            type: data.type || 'unknown',
            recipient: data.recipient || data.email || 'unknown',
            subject: data.subject || 'Sans objet',
            status: data.status || 'sent',
            opened: data.opened || false,
            clicked: data.clicked || false,
            sentAt: data.sentAt?.toDate?.() || new Date(data.sentAt),
          });
        });

        // Sort by date (newest first)
        emailsData.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());

        setEmails(emailsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching emails:', error);
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

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
      (emails.filter((e) => e.opened).length / Math.max(emails.length, 1)) *
        100
    ),
    clickRate: Math.round(
      (emails.filter((e) => e.clicked).length / Math.max(emails.length, 1)) *
        100
    ),
  };

  const emailTypes = [
    { id: 'all', label: 'Tous', count: emails.length },
    {
      id: 'welcome',
      label: 'Bienvenue',
      count: emails.filter((e) => e.type === 'welcome').length,
    },
    {
      id: 'recovery',
      label: 'Récupération',
      count: emails.filter((e) => e.type === 'recovery').length,
    },
    {
      id: 'reminder',
      label: 'Relance',
      count: emails.filter((e) => e.type === 'reminder').length,
    },
    {
      id: 'newsletter',
      label: 'Infolettre',
      count: emails.filter((e) => e.type === 'newsletter').length,
    },
  ];

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
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Emails</h1>
        <p className="text-muted-foreground">
          Suivi des campagnes et performances email
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Emails Envoyés"
          value={stats.total.toString()}
          color="bg-blue-500"
        />
        <StatCard
          label="Taux d'Ouverture"
          value={`${stats.openRate}%`}
          color="bg-green-500"
        />
        <StatCard
          label="Taux de Clic"
          value={`${stats.clickRate}%`}
          color="bg-purple-500"
        />
        <StatCard
          label="Échecs"
          value={stats.failed.toString()}
          color="bg-red-500"
        />
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 flex-wrap">
        {emailTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setTypeFilter(type.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === type.id
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {type.label} ({type.count})
          </button>
        ))}
      </div>

      {/* Emails Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Type
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Destinataire
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Objet
              </th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">
                Statut
              </th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">
                Interactions
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Envoyé
              </th>
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
                  <td className="px-6 py-4 text-foreground font-medium">
                    {email.recipient}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">
                    {email.subject}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {email.status === 'sent' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {email.status === 'failed' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs font-semibold capitalize">
                        {email.status}
                      </span>
                    </div>
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
                    {format(email.sentAt, 'dd MMM HH:mm', { locale: fr })}
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

      {/* Performance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Emails Ouverts
          </h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-foreground">{stats.opened}</p>
            <p className="text-sm text-muted-foreground">
              Taux: {stats.openRate}%
            </p>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${stats.openRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Clics
          </h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-foreground">{stats.clicked}</p>
            <p className="text-sm text-muted-foreground">
              Taux: {stats.clickRate}%
            </p>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${stats.clickRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Échecs
          </h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-foreground">{stats.failed}</p>
            <p className="text-sm text-muted-foreground">
              Taux d'erreur:{' '}
              {Math.round((stats.failed / Math.max(stats.total, 1)) * 100)}%
            </p>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{
                  width: `${Math.round((stats.failed / Math.max(stats.total, 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
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
