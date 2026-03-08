/**
 * Email template de bienvenue pour nouveaux utilisateurs
 * Envoyer lors de l'inscription / création de compte
 */

export interface WelcomeProduct {
  name: string;
  brand: string;
  image: string;
  price: number;
  slug: string;
  shortDescription: string;
}

export function renderWelcomeEmail(
  userName: string,
  userEmail: string,
  featuredProducts: WelcomeProduct[]
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
          }
          .container {
            max-width: 700px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          /* Header */
          .header {
            background: linear-gradient(135deg, #d4145a 0%, #fbb034 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
          }
          .header p {
            font-size: 16px;
            opacity: 0.95;
          }

          /* Content */
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #222;
          }
          .greeting strong {
            color: #d4145a;
          }

          /* Welcome message */
          .welcome-box {
            background: linear-gradient(135deg, rgba(212, 20, 90, 0.08) 0%, rgba(251, 176, 52, 0.08) 100%);
            border-left: 4px solid #d4145a;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .welcome-box p {
            margin: 10px 0;
            color: #555;
          }

          /* Featured products section */
          .featured-title {
            font-size: 22px;
            color: #222;
            margin: 30px 0 20px 0;
            text-align: center;
            font-weight: 600;
          }

          .products-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin: 25px 0;
          }

          .product-card {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            text-align: center;
            transition: transform 0.3s ease;
          }
          .product-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }

          .product-image {
            width: 100%;
            height: 150px;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #999;
            overflow: hidden;
          }
          .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .product-info {
            padding: 15px 10px;
          }
          .product-brand {
            font-size: 11px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          .product-name {
            font-size: 13px;
            font-weight: 600;
            color: #222;
            margin-bottom: 8px;
            line-height: 1.3;
            min-height: 26px;
          }
          .product-price {
            font-size: 16px;
            font-weight: 700;
            color: #d4145a;
          }
          .product-cta {
            display: inline-block;
            background: #d4145a;
            color: white;
            padding: 8px 12px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-top: 10px;
            transition: background 0.3s ease;
          }
          .product-cta:hover {
            background: #b00f47;
          }

          /* Benefits */
          .benefits {
            margin: 35px 0;
            padding: 25px;
            background: #fafafa;
            border-radius: 8px;
          }
          .benefits-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #222;
          }
          .benefit-item {
            display: flex;
            margin: 12px 0;
            font-size: 14px;
            color: #555;
          }
          .benefit-icon {
            margin-right: 12px;
            font-size: 18px;
            min-width: 30px;
          }

          /* CTA Section */
          .cta-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #d4145a 0%, #c00d4d 100%);
            color: white;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(212, 20, 90, 0.3);
          }

          /* Footer */
          .footer {
            background: #333;
            color: white;
            padding: 25px;
            text-align: center;
            font-size: 12px;
          }
          .footer a {
            color: #fbb034;
            text-decoration: none;
          }
          .footer-divider {
            margin: 12px 0;
            opacity: 0.5;
          }

          /* Responsive */
          @media (max-width: 600px) {
            .products-grid {
              grid-template-columns: 1fr;
            }
            .content {
              padding: 25px 20px;
            }
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🌹 Bienvenue chez DubaiNegoce!</h1>
            <p>Rejoignez notre communauté d'amoureux de parfums</p>
          </div>

          <!-- Content -->
          <div class="content">
            <!-- Greeting -->
            <div class="greeting">
              Bonjour <strong>${userName}</strong> 👋
            </div>

            <!-- Welcome message -->
            <div class="welcome-box">
              <p>
                Nous sommes ravi de vous accueillir chez <strong>DubaiNegoce</strong> !
              </p>
              <p>
                Vous avez ouvert les portes d'un univers où la passion pour les parfums n'a pas de limite.
                Chez nous, chaque essence raconte une histoire, chaque note révèle une émotion.
              </p>
              <p>
                Merci de votre confiance. Nous sommes heureux de partager cette belle aventure olfactive avec vous ! 💫
              </p>
            </div>

            <!-- Featured products -->
            <div class="featured-title">
              ✨ Nos pépites du moment
            </div>

            <div class="products-grid">
              ${featuredProducts.map(product => `
                <div class="product-card">
                  <div class="product-image">
                    ${product.image ?
                      `<img src="${product.image}" alt="${product.name}" />`
                      : '<span>Parfum</span>'
                    }
                  </div>
                  <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${product.price.toFixed(0)}€</div>
                    <a href="https://dubainegoce.fr/parfum/${product.slug}" class="product-cta">
                      Découvrir →
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Benefits section -->
            <div class="benefits">
              <div class="benefits-title">Ce qui vous attend chez nous:</div>

              <div class="benefit-item">
                <span class="benefit-icon">✅</span>
                <span><strong>Parfums authentiques & équivalents premium</strong> - Tous nos produits sont certifiés authentiques</span>
              </div>

              <div class="benefit-item">
                <span class="benefit-icon">🚚</span>
                <span><strong>Livraison rapide</strong> - Expédition en 48h en France métropolitaine</span>
              </div>

              <div class="benefit-item">
                <span class="benefit-icon">💰</span>
                <span><strong>Tarifs fixes toute l'année</strong> - 35€ pour tous nos parfums 80ml, sans surprise</span>
              </div>

              <div class="benefit-item">
                <span class="benefit-icon">🛡️</span>
                <span><strong>Garantie satisfait ou remboursé</strong> - Retour gratuit sous 14 jours</span>
              </div>

              <div class="benefit-item">
                <span class="benefit-icon">👥</span>
                <span><strong>Service client réactif</strong> - Nous sommes là pour vous aider</span>
              </div>

              <div class="benefit-item">
                <span class="benefit-icon">🎁</span>
                <span><strong>Communauté passionnée</strong> - Partage d'avis, recommandations, événements exclusifs</span>
              </div>
            </div>

            <!-- CTA Principal -->
            <div class="cta-section">
              <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
                Prêt à explorer l'univers infini des parfums ?
              </p>
              <a href="https://dubainegoce.fr/shop" class="cta-button">
                Commencer ma visite olfactive
              </a>
            </div>

            <!-- Votre compte section -->
            <div style="margin-top: 30px; padding: 20px; background: #f0f8ff; border-radius: 8px; border-left: 3px solid #d4145a;">
              <p style="font-size: 14px; font-weight: 600; color: #222; margin-bottom: 12px;">
                🎯 Vos outils personnels
              </p>
              <p style="font-size: 13px; color: #666; margin: 8px 0;">
                ✓ <a href="https://dubainegoce.fr/account/profile" style="color: #d4145a; text-decoration: none; font-weight: 500;">Gérer mon profil</a> - Modifier vos informations, changer votre mot de passe
              </p>
              <p style="font-size: 13px; color: #666; margin: 8px 0;">
                ✓ <a href="https://dubainegoce.fr/account/orders" style="color: #d4145a; text-decoration: none; font-weight: 500;">Suivre mes commandes</a> - Vérifiez l'état de vos livraisons en temps réel
              </p>
              <p style="font-size: 13px; color: #666; margin: 8px 0;">
                ✓ <a href="https://dubainegoce.fr/wishlist" style="color: #d4145a; text-decoration: none; font-weight: 500;">Ma liste d'envies</a> - Sauvegardez vos parfums préférés pour plus tard
              </p>
            </div>

            <!-- Support section -->
            <div style="margin-top: 30px; padding: 20px; background: #fff9f3; border-radius: 8px;">
              <p style="font-size: 14px; font-weight: 600; color: #222; margin-bottom: 12px;">
                ❓ Besoin d'aide ?
              </p>
              <p style="font-size: 13px; color: #666; margin-bottom: 10px;">
                Problème de commande, question de paiement, ou besoin de conseil ? Notre équipe vous répond rapidement :
              </p>
              <p style="font-size: 13px; color: #555; margin: 8px 0;">
                📧 Email : <a href="mailto:contact@dubainegoce.fr" style="color: #d4145a; text-decoration: none; font-weight: 500;">contact@dubainegoce.fr</a>
              </p>
              <p style="font-size: 13px; color: #555; margin: 8px 0;">
                📞 Téléphone : <a href="tel:+33780299333" style="color: #d4145a; text-decoration: none; font-weight: 500;">07 80 29 93 33</a>
              </p>
              <p style="font-size: 12px; color: #999; margin-top: 10px; font-style: italic;">
                Nous sommes disponibles du lundi au vendredi, 10h-18h (UTC+1)
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="font-size: 13px; margin-bottom: 10px;">
              © 2026 DubaiNegoce - Tous droits réservés
            </p>
            <div class="footer-divider">|</div>
            <p>
              Vous recevez cet email car vous venez de créer un compte chez DubaiNegoce.<br>
              <a href="https://dubainegoce.fr/mentions-legales">Mentions légales</a> •
              <a href="https://dubainegoce.fr/terms">Conditions générales</a>
            </p>
            <div class="footer-divider">|</div>
            <p style="margin-top: 10px;">
              Bienvenue dans la grande famille des amoureux de parfums ! 💐
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
