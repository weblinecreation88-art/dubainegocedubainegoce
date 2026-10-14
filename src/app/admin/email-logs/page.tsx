'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminFetch } from '@/lib/admin-fetch';

interface EmailLog {
  id: string;
  email: string;
  type: string;
  subject: string;
  status: string;
  method?: 'brevo' | 'resend' | 'gmail' | string;
  sentAt: any;
  opened: boolean;
  clicked: boolean;
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      setLoading(true);
      const response = await adminFetch('/api/admin/email-logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(log =>
    (log.email || '').toLowerCase().includes(searchEmail.toLowerCase())
  );

  const stats = {
    total: logs.length,
    brevo: logs.filter(l => (l.method || 'brevo') === 'brevo').length,
    failed: logs.filter(l => l.status === 'failed').length,
    opened: logs.filter(l => l.opened).length,
    clicked: logs.filter(l => l.clicked).length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">📧 Email Campaign Logs</h1>
        <p className="text-gray-500">Track all sent emails and their status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Via Brevo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.brevo}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Échecs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Opened</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.opened}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clicked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.clicked}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={fetchLogs} variant="outline">
          🔄 Refresh
        </Button>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
          <CardDescription>{filteredLogs.length} email(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Subject</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-left py-2 px-4">Method</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Sent At</th>
                  <th className="text-left py-2 px-4">Opened</th>
                  <th className="text-left py-2 px-4">Clicked</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-mono text-xs">{log.email}</td>
                      <td className="py-2 px-4 text-gray-600">{log.subject}</td>
                      <td className="py-2 px-4">
                        <Badge variant="outline">{log.type}</Badge>
                      </td>
                      <td className="py-2 px-4">
                        <Badge
                          variant={(log.method || 'brevo') === 'brevo' ? 'default' : 'secondary'}
                        >
                          {log.method ? log.method.charAt(0).toUpperCase() + log.method.slice(1) : 'Brevo'}
                        </Badge>
                      </td>
                      <td className="py-2 px-4">
                        <Badge variant="outline" className={log.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-green-50'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-4 text-xs text-gray-500">
                        {log.sentAt?.toDate?.()?.toLocaleString?.() ||
                          new Date(log.sentAt?.seconds * 1000).toLocaleString()}
                      </td>
                      <td className="py-2 px-4">
                        {log.opened ? '✅' : '❌'}
                      </td>
                      <td className="py-2 px-4">
                        {log.clicked ? '✅' : '❌'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
