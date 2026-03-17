'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PayPalButtonProps {
  price: number;
  productName: string;
  quantity: number;
}

export function PayPalButton({ price, productName, quantity }: PayPalButtonProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

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

      {status !== 'success' && (
        <PayPalScriptProvider
          options={{
            clientId,
            currency: 'EUR',
            locale: 'fr_FR',
            intent: 'capture',
          }}
        >
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
                body: JSON.stringify({
                  amount: price,
                  productName,
                  quantity,
                }),
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
                setMessage('Le paiement n\'a pas pu être confirmé. Réessayez.');
                return;
              }
              const amount = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
              setStatus('success');
              setMessage(`Paiement de ${amount ? `${amount} €` : `${(price * quantity).toFixed(2)} €`} confirmé ! Merci pour votre commande.`);
            }}
            onError={() => {
              setStatus('error');
              setMessage('Une erreur est survenue avec PayPal. Veuillez réessayer.');
            }}
            onCancel={() => {
              setStatus('idle');
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
}
