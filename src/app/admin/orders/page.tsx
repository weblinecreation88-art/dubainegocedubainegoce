'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/firebase';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  itemPrice: number;
  image?: string;
}

interface Order {
  id: string;
  userId: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  totalAmount: number;
  orderItems?: OrderItem[];
  status: string;
  orderDate?: string;
  createdAt?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  pickupPoint?: { name?: string; address?: string; postalCode?: string; city?: string };
}

const STATUS_LABEL: Record<string, string> = {
  completed: 'Payée — À expédier',
  pending: 'En attente',
  processing: 'En préparation',
  shipped: 'Expédiée ✅',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

function statusClass(status: string) {
  switch (status) {
    case 'shipped':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
    case 'delivered':
      return 'bg-green-500/10 text-green-600 border-green-500/30';
    case 'cancelled':
      return 'bg-red-500/10 text-red-600 border-red-500/30';
    case 'completed':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

function buildWhatsAppTrackingUrl(order: Order, trackingCode: string): string | null {
  const rawPhone = (order.customerPhone || '').replace(/\D/g, '');
  if (!rawPhone) return null;
  let intlPhone = rawPhone;
  if (rawPhone.startsWith('0') && rawPhone.length === 10) {
    intlPhone = '33' + rawPhone.slice(1);
  } else if (rawPhone.startsWith('00')) {
    intlPhone = rawPhone.slice(2);
  }
  const code = trackingCode.trim().toUpperCase();
  const trackUrl = `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(code)}`;
  const itemsList = (order.orderItems || [])
    .map((it) => `${it.name} (x${it.quantity})`)
    .join(', ');
  const firstName = (order.customerName || 'Client').split(' ')[0];
  const msg = [
    `Bonjour ${firstName}, c'est l'équipe Dubaï Négoce ! 🌟`,
    ``,
    `Bonne nouvelle : votre commande (${itemsList || 'Parfums de Dubaï'}) vient d'être expédiée en Colissimo suivi.`,
    ``,
    `📦 Numéro de suivi : *${code}*`,
    `🔗 Suivre votre colis en direct : ${trackUrl}`,
    ``,
    `Merci pour votre confiance et excellente réception !`,
  ].join('\n');
  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
}

function OrderDate({ order }: { order: Order }) {
  const value = order.orderDate || order.createdAt;
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return <span className="text-sm text-muted-foreground">Date indisponible</span>;
  }

  return (
    <time dateTime={date.toISOString()} className="block text-sm tabular-nums whitespace-nowrap">
      <span className="block font-semibold">
        {date.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}
      </span>
      <span className="block text-xs text-muted-foreground">
        {date.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' })}
        {' · Paris'}
      </span>
    </time>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; ok: boolean; msg: string; waUrl?: string | null } | null>(null);
  const { user } = useUser();

  const authHeaders = useCallback(async (): Promise<HeadersInit> => {
    if (!user) return {};
    return { Authorization: `Bearer ${await user.getIdToken()}` };
  }, [user]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/admin/orders', { headers: await authHeaders() });
      if (!response.ok) throw new Error('Failed to fetch orders');
      setOrders(await response.json());
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user, authHeaders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const markAsShipped = async (order: Order, alsoOpenWhatsApp = false) => {
    const num = (tracking[order.id] || '').trim().toUpperCase();
    if (!num) {
      setFeedback({ id: order.id, ok: false, msg: 'Saisissez un numéro de suivi Colissimo.' });
      return;
    }

    const waUrl = buildWhatsAppTrackingUrl(order, num);
    if (alsoOpenWhatsApp && waUrl) {
      window.open(waUrl, '_blank');
    }

    setSending(order.id);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/orders/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({
          userId: order.userId,
          orderId: order.id,
          trackingNumber: num,
          carrier: order.shippingMethod || 'colissimo',
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Échec de l'expédition");

      setFeedback({
        id: order.id,
        ok: true,
        msg: data.emailSent
          ? `✅ Commande marquée expédiée ! Le client a reçu son e-mail automatique avec le suivi ${num}.`
          : data.message || 'Commande expédiée (vous pouvez aussi lui envoyer le WhatsApp ci-dessous).',
        waUrl,
      });
      await fetchOrders();
    } catch (e: any) {
      setFeedback({ id: order.id, ok: false, msg: e.message || 'Erreur' });
    } finally {
      setSending(null);
    }
  };

  const filteredOrders =
    statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  const stats = {
    total: orders.length,
    aExpedier: orders.filter((o) => o.status === 'completed' || o.status === 'processing').length,
    expediees: orders.filter((o) => o.status === 'shipped').length,
    chiffre: orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
  };

  if (loading) {
    return <div className="p-8 text-muted-foreground">Chargement des commandes…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">📦 Commandes &amp; Expéditions Colissimo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Entrez le numéro de suivi Colissimo : le client reçoit <strong>automatiquement un e-mail</strong> avec le lien La Poste, et vous pouvez aussi le prévenir <strong>en 1 clic sur WhatsApp</strong>.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Commandes" value={String(stats.total)} />
        <StatCard label="À expédier" value={String(stats.aExpedier)} highlight={stats.aExpedier > 0} />
        <StatCard label="Expédiées" value={String(stats.expediees)} />
        <StatCard label="Chiffre d'affaires" value={`${stats.chiffre.toFixed(2)} €`} />
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'completed', 'shipped', 'delivered'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
              statusFilter === s
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background border-border hover:bg-muted'
            }`}
          >
            {s === 'all' ? 'Toutes' : STATUS_LABEL[s] || s}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="border rounded-lg p-10 text-center text-muted-foreground">
          Aucune commande dans cette catégorie.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isOpen = expanded === order.id;
            const canShip = order.status !== 'shipped' && order.status !== 'delivered';
            const currentCode = (tracking[order.id] || order.trackingNumber || '').trim();
            const waTrackingLink = currentCode ? buildWhatsAppTrackingUrl(order, currentCode) : null;

            return (
              <div key={order.id} className="border rounded-lg overflow-hidden bg-background">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex flex-wrap items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
                >
                  <span className="min-w-[105px] border-r pr-3">
                    <span className="block text-xs text-muted-foreground mb-1">Commandée le</span>
                    <OrderDate order={order} />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 12)}
                  </span>
                  <span className="font-medium">{order.customerName || '—'}</span>
                  <span className="text-sm text-muted-foreground">{order.customerEmail}</span>
                  <span className="ml-auto font-semibold">
                    {(order.totalAmount || 0).toFixed(2)} €
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusClass(order.status)}`}
                  >
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t p-4 space-y-4 bg-muted/20">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs uppercase text-muted-foreground mb-1 font-semibold">Adresse de Livraison (Colissimo)</div>
                        {order.shippingAddress && (
                          <div className="text-foreground font-medium mt-1">
                            {order.customerName}
                            <br />
                            {order.shippingAddress.line1}
                            <br />
                            {order.shippingAddress.postalCode} {order.shippingAddress.city} ({order.shippingAddress.country || 'FR'})
                          </div>
                        )}
                        {order.customerPhone && (
                          <div className="text-muted-foreground mt-1">
                            📞 Tél : <strong>{order.customerPhone}</strong>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs uppercase text-muted-foreground mb-1 font-semibold">Parfums à préparer</div>
                        {(order.orderItems || []).map((it, i) => (
                          <div key={i} className="flex justify-between gap-2 py-1 border-b last:border-0">
                            <span className="font-medium">{it.name}</span>
                            <span className="font-bold whitespace-nowrap">
                              x{it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.trackingNumber ? (
                      <div className="rounded-md border bg-background p-3 text-sm flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="text-muted-foreground">✅ Expédiée — Numéro de suivi : </span>
                          <a
                            href={`https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(order.trackingNumber)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono font-bold underline"
                          >
                            {order.trackingNumber}
                          </a>
                          {order.shippedAt && (
                            <span className="text-muted-foreground">
                              {' '}
                              le {new Date(order.shippedAt).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                        {waTrackingLink && (
                          <a
                            href={waTrackingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            💬 Envoyer le suivi sur WhatsApp au client
                          </a>
                        )}
                      </div>
                    ) : canShip ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            value={tracking[order.id] || ''}
                            onChange={(e) =>
                              setTracking((t) => ({ ...t, [order.id]: e.target.value }))
                            }
                            placeholder="Ex: 6A12345678901 (Numéro de suivi Colissimo)"
                            className="flex-1 min-w-[240px] px-3 py-2 rounded-md border bg-background text-sm font-mono"
                          />
                          <button
                            onClick={() => markAsShipped(order, false)}
                            disabled={sending === order.id}
                            className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold disabled:opacity-50"
                          >
                            {sending === order.id ? 'Envoi en cours…' : '📧 Valider + Envoyer Email Auto'}
                          </button>
                          {order.customerPhone && (
                            <button
                              onClick={() => markAsShipped(order, true)}
                              disabled={sending === order.id}
                              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-50"
                            >
                              💬 Valider + Email + WhatsApp Client
                            </button>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {feedback?.id === order.id && (
                      <div
                        className={`text-sm font-medium ${feedback.ok ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {feedback.msg}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-4 ${highlight ? 'border-amber-500/50 bg-amber-500/5' : ''}`}>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
