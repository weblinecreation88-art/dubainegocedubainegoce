import React from 'react';

interface AbandonedCartDay3EmailProps {
  customerName: string;
  cartItems: Array<{
    name: string;
    quantity: number;
    itemPrice: number;
    image?: string;
  }>;
  cartTotal: number;
  promoCode: string;
  cartLink: string;
}

export function AbandonedCartDay3Email({
  customerName,
  cartItems,
  cartTotal,
  promoCode,
  cartLink
}: AbandonedCartDay3EmailProps) {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#f8f8f8', padding: '20px', textAlign: 'center', borderBottom: '2px solid #d63384' }}>
          <h1 style={{ margin: '0', color: '#d63384' }}>Dubainegoce</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>Vos parfums de Dubaï préférés</p>
        </div>

        {/* Main Content */}
        <div style={{ padding: '30px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>Bonjour {customerName},</h2>

          <p style={{ marginBottom: '20px' }}>
            Nous avons remarqué que vous aviez ajouté des parfums à votre panier il y a quelques jours.
          </p>

          <p style={{ marginBottom: '20px', fontWeight: 'bold', color: '#d63384' }}>
            Bonne nouvelle! Nous vous offrons <span style={{ fontSize: '18px' }}>5% de réduction</span> sur votre commande aujourd'hui.
          </p>

          {/* Cart Summary */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>Votre sélection:</h3>

            {cartItems.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '15px',
                borderBottom: index < cartItems.length - 1 ? '1px solid #eee' : 'none'
              }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{item.name}</p>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    Quantité: {item.quantity} × {item.itemPrice.toFixed(2)}€
                  </p>
                </div>
                <p style={{ margin: '0', fontWeight: 'bold' }}>
                  {(item.itemPrice * item.quantity).toFixed(2)}€
                </p>
              </div>
            ))}

            <div style={{
              paddingTop: '15px',
              borderTop: '2px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              <span>Total:</span>
              <span>{cartTotal.toFixed(2)}€</span>
            </div>
          </div>

          {/* Promo Code */}
          <div style={{
            backgroundColor: '#fff3f7',
            border: '2px dashed #d63384',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              Utilisez ce code promo à la caisse:
            </p>
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #d63384',
              borderRadius: '4px',
              padding: '12px 20px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#d63384',
              letterSpacing: '2px',
              fontFamily: 'monospace'
            }}>
              {promoCode}
            </div>
            <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '12px' }}>
              5% de réduction - Valable 7 jours
            </p>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <a href={cartLink} style={{
              display: 'inline-block',
              backgroundColor: '#d63384',
              color: '#fff',
              padding: '14px 40px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              Finaliser ma commande
            </a>
          </div>

          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Vous hésitez? Nos parfums authentiques de Dubaï sont sélectionnés pour leur qualité exceptionnelle.
          </p>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #ddd',
            paddingTop: '20px',
            marginTop: '30px',
            fontSize: '12px',
            color: '#999',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 5px 0' }}>
              © {new Date().getFullYear()} Dubainegoce. Tous droits réservés.
            </p>
            <p style={{ margin: '0' }}>
              contact@dubainegoce.fr
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

export function renderAbandonedCartDay3Email(props: AbandonedCartDay3EmailProps): string {
  const html = AbandonedCartDay3Email(props);
  return html.props.children as unknown as string;
}
