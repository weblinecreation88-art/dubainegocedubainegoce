'use client';

import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PayPalButtonProps {
  price: number;
  productName: string;
  quantity: number;
  clientId: string;
}

function PayPalButtonInner({ price, productName, quantity }: Omit<PayPalButtonProps, 'clientId'>) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (isRejected) return null; // Cache silencieusement si PayPal indisponible

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

      {isPending && (
        <div className="w-full h-[45px] bg-yellow-50 border border-yellow-200 rounded flex items-center justify-center gap-2 text-sm text-yellow-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement PayPal...
        </div>
      )}

      {status !== 'success' && (
        <PayPalButtons
          style={{
            layout: 'horizontal',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 45,
            tagline: false,
          }}
          createOrder={async () => {
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: price, productName, quantity }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur création commande');
            return data.id;
          }}
          onApprove={async (data) => {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const capture = await res.json();
            if (!res.ok) {
              setStatus('error');
              setMessage("Le paiement n'a pas pu être confirmé. Réessayez.");
              return;
            }
            const amt = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
            setStatus('success');
            setMessage(`Paiement de ${amt ? `${amt} €` : `${(price * quantity).toFixed(2)} €`} confirmé ! Merci.`);
          }}
          onError={() => {
            setStatus('error');
            setMessage('Une erreur PayPal est survenue. Veuillez réessayer.');
          }}
          onCancel={() => setStatus('idle')}
        />
      )}
    </div>
  );
}

export function PayPalButton({ price, productName, quantity, clientId }: PayPalButtonProps) {
  if (!clientId) return null;

  return (
    <PayPalScriptProvider
      options={{ clientId, currency: 'EUR', locale: 'fr_FR', intent: 'capture' }}
    >
      {/* Séparateur */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">ou payer avec</span>
        <div className="flex-1 border-t border-border" />
      </div>
      <PayPalButtonInner price={price} productName={productName} quantity={quantity} />
    </PayPalScriptProvider>
  );
}
