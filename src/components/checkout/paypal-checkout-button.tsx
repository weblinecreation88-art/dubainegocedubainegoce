'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PayPalCheckoutButtonProps {
  items: CartItem[];
  total: number;
  shippingCost: number;
  onSuccess: (orderId: string) => void;
  disabled?: boolean;
}

export function PayPalCheckoutButton({
  items,
  total,
  shippingCost,
  onSuccess,
  disabled = false,
}: PayPalCheckoutButtonProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const subtotal = total - shippingCost;

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
              height: 50,
              tagline: false,
            }}
            createOrder={async () => {
              const res = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  amount: subtotal.toFixed(2),
                  shippingAmount: shippingCost.toFixed(2),
                  productName: `Commande Dubai Négoce (${items.length} article${items.length > 1 ? 's' : ''})`,
                  quantity: 1,
                  items: items.map((item) => ({
                    name: item.name,
                    quantity: String(item.quantity),
                    unit_amount: {
                      currency_code: 'EUR',
                      value: item.price.toFixed(2),
                    },
                  })),
                  total: total.toFixed(2),
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
              setStatus('success');
              setMessage(`Paiement de ${total.toFixed(2)} € confirmé ! Merci pour votre commande.`);
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
