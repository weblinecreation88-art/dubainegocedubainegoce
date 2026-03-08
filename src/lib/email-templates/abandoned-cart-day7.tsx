import React from 'react';

interface AbandonedCartDay7EmailProps {
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
  discountPercentage: number;
}

export function AbandonedCartDay7Email({
  customerName,
  cartItems,
  cartTotal,
  promoCode,
  cartLink,
  discountPercentage = 5
}: AbandonedCartDay7EmailProps) {
  const discountAmount = (cartTotal * discountPercentage) / 100;
  const finalTotal = cartTotal - discountAmount;

  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
        {/* Alert Header */}
        <div style={{ backgroundColor: '#d63384', padding: '15px', textAlign: 'center', color: '#fff' }}>
          <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px' }}>
            ⏰ Dernière chance! Votre réduction expire dans 1 jour
          </p>
        </div>

        {/* Main Header */}
        <div style={{ backgroundColor: '#f8f8f8', padding: '20px', textAlign: 'center', borderBottom: '2px solid #d63384' }}>
          <h1 style={{ margin: '0', color: '#d63384' }}>Dubainegoce</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>Vos parfums de Dubaï préférés</p>
        </div>

        {/* Main Content */}
        <div style={{ padding: '30px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#d63384', marginBottom: '20px' }}>Bonjour {customerName},</h2>

          <p style={{ marginBottom: '20px', fontSize: '16px', color: '#d63384', fontWeight: 'bold' }}>
            Vous avez oublié votre réduction de {discountPercentage}%!
          </p>

          <p style={{ marginBottom: '20px' }}>
            Vos parfums de Dubaï préférés sont toujours disponibles dans votre panier. Ne manquez pas cette offre exclusive qui expire <strong>demain</strong>.
          </p>

          {/* Savings Highlight */}
          <div style={{
            backgroundColor: '#fff3f7',
            border: '2px solid #d63384',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>Vous économiseriez:</p>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d63384' }}>
              {discountAmount.toFixed(2)}€
            </div>
            <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '14px' }}>
              {cartTotal.toFixed(2)}€ → <strong>{finalTotal.toFixed(2)}€</strong>
            </p>
          </div>

          {/* Cart Summary */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>Votre panier:</h3>

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
                    {item.quantity} × {item.itemPrice.toFixed(2)}€
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

          {/* Urgent Promo Code */}
          <div style={{
            backgroundColor: '#d63384',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#fff'
          }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              Votre code promo (expire demain):
            </p>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '2px solid #fff',
              borderRadius: '4px',
              padding: '12px 20px',
              fontSize: '28px',
              fontWeight: 'bold',
              letterSpacing: '3px',
              fontFamily: 'monospace',
              marginBottom: '10px'
            }}>
              {promoCode}
            </div>
            <p style={{ margin: '0', fontSize: '12px', opacity: '0.9' }}>
              Ajouter le code à la caisse pour obtenir {discountPercentage}% de réduction
            </p>
          </div>

          {/* Urgent CTA Button */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <a href={cartLink} style={{
              display: 'inline-block',
              backgroundColor: '#d63384',
              color: '#fff',
              padding: '16px 50px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              boxShadow: '0 4px 8px rgba(214, 51, 132, 0.3)'
            }}>
              Commander avant que ce soit trop tard ✓
            </a>
          </div>

          {/* Social Proof */}
          <div style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#666'
          }}>
            <p style={{ margin: '0' }}>
              ✓ 2000+ clients satisfaits<br/>
              ✓ Parfums 100% authentiques<br/>
              ✓ Livraison rapide en 2-3 jours
            </p>
          </div>

          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            <strong>Hésitez-vous encore?</strong><br/>
            Nos parfums offrent un excellent rapport qualité-prix avec une garantie d'authenticité.
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
              contact@dubainegoce.fr | <a href="https://dubainegoce.fr" style={{ color: '#d63384', textDecoration: 'none' }}>www.dubainegoce.fr</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

export function renderAbandonedCartDay7Email(props: AbandonedCartDay7EmailProps): string {
  const html = AbandonedCartDay7Email(props);
  return html.props.children as unknown as string;
}
