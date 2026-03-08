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

interface AbandonedCartDay3EmailProps {
  customerName: string;
  cartItems: CartItem[];
  cartTotal: number;
  promoCode: string;
  cartLink: string;
}

export const AbandonedCartDay3Email = ({
  customerName,
  cartItems,
  cartTotal,
  promoCode,
  cartLink
}: AbandonedCartDay3EmailProps) => (
  <Html>
    <Head />
    <Preview>Vous avez oublié vos parfums! 5% de réduction valable 7 jours</Preview>
    <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
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
          <Heading style={{ color: '#333', marginBottom: '20px' }}>
            Bonjour {customerName},
          </Heading>

          <Text style={{ marginBottom: '20px' }}>
            Nous avons remarqué que vous aviez ajouté des parfums à votre panier il y a quelques jours.
          </Text>

          <Text style={{ marginBottom: '20px', fontWeight: 'bold', color: '#d63384' }}>
            Bonne nouvelle! Nous vous offrons <span style={{ fontSize: '18px' }}>5% de réduction</span> sur votre commande aujourd'hui.
          </Text>

          {/* Cart Summary */}
          <Section style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <Heading style={{ marginTop: '0', marginBottom: '15px', color: '#333', fontSize: '16px' }}>
              Votre sélection:
            </Heading>

            {cartItems.map((item, index) => (
              <div key={index} style={{ paddingBottom: '15px', borderBottom: index < cartItems.length - 1 ? '1px solid #eee' : 'none' }}>
                <Text style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                  Quantité: {item.quantity} × {item.itemPrice.toFixed(2)}€
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

          {/* Promo Code */}
          <Section style={{ backgroundColor: '#fff3f7', border: '2px dashed #d63384', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <Text style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
              Utilisez ce code promo à la caisse:
            </Text>
            <div style={{ backgroundColor: '#fff', border: '1px solid #d63384', borderRadius: '4px', padding: '12px 20px', fontSize: '24px', fontWeight: 'bold', color: '#d63384', letterSpacing: '2px', fontFamily: 'monospace' }}>
              {promoCode}
            </div>
            <Text style={{ margin: '10px 0 0 0', color: '#666', fontSize: '12px' }}>
              5% de réduction - Valable 7 jours
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Link href={cartLink} style={{ display: 'inline-block', backgroundColor: '#d63384', color: '#fff', padding: '14px 40px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              Finaliser ma commande
            </Link>
          </Section>

          <Text style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Vous hésitez? Nos parfums authentiques de Dubaï sont sélectionnés pour leur qualité exceptionnelle.
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

AbandonedCartDay3Email.PreviewProps = {
  customerName: 'Jean',
  cartItems: [
    { name: 'Lattafa Asad', quantity: 1, itemPrice: 35 }
  ],
  cartTotal: 35,
  promoCode: 'COMEBACK5',
  cartLink: 'https://dubainegoce.fr/cart'
};

export default AbandonedCartDay3Email;
