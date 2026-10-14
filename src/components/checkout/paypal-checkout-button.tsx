'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';

interface CartLine {
  id: string;
  quantity: number;
}

export interface PayPalCustomerInfo {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode?: string;
  city: string;
  country: string;
}

interface PayPalCheckoutButtonProps {
  items: CartLine[];
  total: number;
  customerInfo: PayPalCustomerInfo | null;
  shippingMethod: 'colissimo' | 'mondial-relay';
  pickupPoint?: MondialRelayPickupPoint | null;
  /** Renvoie le jeton Firebase si le client est connecte (sinon commande invitee). */
  getIdToken?: () => Promise<string | null>;
  onSuccess: (orderId: string) => void;
  disabled?: boolean;
}

export function PayPalCheckoutButton({
  items,
  total,
  customerInfo,
  shippingMethod,
  pickupPoint,
  getIdToken,
  onSuccess,
  disabled = false,
}: PayPalCheckoutButtonProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!clientId) return null;

  const country = customerInfo?.country || 'FR';
  const cartLines = items.map((i) => ({ id: i.id, quantity: i.quantity }));

  return (
    <div className="w-full">
      {status === 'success' && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-3">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-3">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status !== 'success' && !disabled && (
        <PayPalScriptProvider options={{ clientId, currency: 'EUR', locale: 'fr_FR', intent: 'capture' }}>
          <PayPalButtons
            style={{ layout: 'horizontal', color: 'gold', shape: 'rect', label: 'paypal', height: 50, tagline: false }}
            forceReRender={[total, shippingMethod, country, pickupPoint?.id]}
            createOrder={async () => {
              setStatus('idle');
              const res = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartLines, shippingMethod, country }),
              });
              const data = await res.json();
              if (!res.ok) {
                setStatus('error');
                setMessage(data.error || 'Impossible de créer la commande PayPal.');
                throw new Error(data.error || 'Erreur création commande');
              }
              return data.id;
            }}
            onApprove={async (data) => {
              const token = getIdToken ? await getIdToken() : null;
              const res = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  orderID: data.orderID,
                  items: cartLines,
                  shippingMethod,
                  country,
                  customer: customerInfo,
                  pickupPoint: pickupPoint
                    ? {
                        id: pickupPoint.id,
                        name: pickupPoint.name,
                        address: pickupPoint.address,
                        postalCode: pickupPoint.postalCode,
                        city: pickupPoint.city,
                      }
                    : null,
                }),
              });
              const capture = await res.json();
              if (!res.ok) {
                setStatus('error');
                setMessage(capture.error || "Le paiement n'a pas pu être confirmé. Réessayez.");
                return;
              }
              const paid = Number(capture.total) || total;
              setStatus('success');
              setMessage(`Paiement de ${paid.toFixed(2)} € confirmé ! Merci pour votre commande.`);
              onSuccess(data.orderID);
            }}
            onError={() => {
              setStatus('error');
              setMessage('Une erreur PayPal est survenue. Veuillez réessayer ou payer par carte.');
            }}
            onCancel={() => setStatus('idle')}
          />
        </PayPalScriptProvider>
      )}

      {disabled && (
        <div className="w-full h-[50px] bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
          Remplissez vos informations pour activer PayPal
        </div>
      )}
    </div>
  );
}
