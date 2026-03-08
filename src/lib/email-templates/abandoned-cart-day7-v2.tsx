import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface CartItem {
  name: string;
  quantity: number;
  itemPrice: number;
}

interface AbandonedCartDay7EmailProps {
  customerName: string;
  cartItems: CartItem[];
  cartTotal: number;
  promoCode: string;
  cartLink: string;
  discountPercentage?: number;
}

export const AbandonedCartDay7Email = ({
  customerName,
  cartItems,
  cartTotal,
  promoCode,
  cartLink,
  discountPercentage = 5
}: AbandonedCartDay7EmailProps) => {
  const discountAmount = (cartTotal * discountPercentage) / 100;
  const finalTotal = cartTotal - discountAmount;

  return (
    <Html>
      <Head />
      <Preview>⏰ DERNIER RAPPEL: Votre réduction de 5% expire demain!</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
        {/* Alert Header */}
        <Section style={{ backgroundColor: '#d63384', padding: '15px', textAlign: 'center', color: '#fff' }}>
          <Text style={{ margin: '0', fontWeight: 'bold', fontSize: '16px' }}>
            ⏰ Dernière chance! Votre réduction expire dans 1 jour
          </Text>
        </Section>

        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#f8f8f8', padding: '20px', textAlign: 'center', borderBottom: '2px solid #d63384' }}>
            <Heading style={{ color: '#d63384', margin: '0', fontSize: '28px' }}>
              Dubainegoce
            </Heading>
            <Text style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>
              Vos parfums de Dubaï préférés
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: '30px 20px', backgroundColor: '#fff' }}>
            <Heading style={{ color: '#d63384', marginBottom: '20px' }}>
              Bonjour {customerName},
            </Heading>

            <Text style={{ marginBottom: '20px', fontSize: '16px', color: '#d63384', fontWeight: 'bold' }}>
              Vous avez oublié votre réduction de {discountPercentage}%!
            </Text>

            <Text style={{ marginBottom: '20px' }}>
              Vos parfums de Dubaï préférés sont toujours disponibles dans votre panier. Ne manquez pas cette offre exclusive qui expire <strong>demain</strong>.
            </Text>

            {/* Savings Highlight */}
            <Section style={{ backgroundColor: '#fff3f7', border: '2px solid #d63384', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <Text style={{ margin: '0 0 10px 0', color: '#666' }}>
                Vous économiseriez:
              </Text>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d63384' }}>
                {discountAmount.toFixed(2)}€
              </div>
              <Text style={{ margin: '10px 0 0 0', color: '#666', fontSize: '14px' }}>
                {cartTotal.toFixed(2)}€ → <strong>{finalTotal.toFixed(2)}€</strong>
              </Text>
            </Section>

            {/* Cart Summary */}
            <Section style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
              <Heading style={{ marginTop: '0', marginBottom: '15px', color: '#333', fontSize: '16px' }}>
                Votre panier:
              </Heading>

              {cartItems.map((item, index) => (
                <div key={index} style={{ paddingBottom: '15px', borderBottom: index < cartItems.length - 1 ? '1px solid #eee' : 'none' }}>
                  <Text style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    {item.quantity} × {item.itemPrice.toFixed(2)}€
                  </Text>
                  <Text style={{ textAlign: 'right', margin: '0' }}>
                    {(item.itemPrice * item.quantity).toFixed(2)}€
                  </Text>
                </div>
              ))}

              <div style={{ paddingTop: '15px', borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
                <Text>Total:</Text>
                <Text>{cartTotal.toFixed(2)}€</Text>
              </div>
            </Section>

            {/* Urgent Promo Code */}
            <Section style={{ backgroundColor: '#d63384', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '20px', color: '#fff' }}>
              <Text style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Votre code promo (expire demain):
              </Text>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid #fff', borderRadius: '4px', padding: '12px 20px', fontSize: '28px', fontWeight: 'bold', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '10px' }}>
                {promoCode}
              </div>
              <Text style={{ margin: '0', fontSize: '12px', opacity: '0.9' }}>
                Ajouter le code à la caisse pour obtenir {discountPercentage}% de réduction
              </Text>
            </Section>

            {/* Urgent CTA Button */}
            <Section style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Link href={cartLink} style={{ display: 'inline-block', backgroundColor: '#d63384', color: '#fff', padding: '16px 50px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
                Commander avant que ce soit trop tard ✓
              </Link>
            </Section>

            {/* Social Proof */}
            <Section style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
              <Text style={{ margin: '0 0 5px 0' }}>✓ 2000+ clients satisfaits</Text>
              <Text style={{ margin: '0 0 5px 0' }}>✓ Parfums 100% authentiques</Text>
              <Text style={{ margin: '0' }}>✓ Livraison rapide en 2-3 jours</Text>
            </Section>

            <Text style={{ color: '#666', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
              <strong>Hésitez-vous encore?</strong><br/>
              Nos parfums offrent un excellent rapport qualité-prix avec une garantie d'authenticité.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginTop: '30px', fontSize: '12px', color: '#999', textAlign: 'center', padding: '20px' }}>
            <Text style={{ margin: '0 0 5px 0' }}>
              © {new Date().getFullYear()} Dubainegoce. Tous droits réservés.
            </Text>
            <Text style={{ margin: '0' }}>
              contact@dubainegoce.fr
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

AbandonedCartDay7Email.PreviewProps = {
  customerName: 'Jean',
  cartItems: [
    { name: 'Lattafa Asad', quantity: 1, itemPrice: 35 }
  ],
  cartTotal: 35,
  promoCode: 'COMEBACK5',
  cartLink: 'https://dubainegoce.fr/cart',
  discountPercentage: 5
};

export default AbandonedCartDay7Email;
