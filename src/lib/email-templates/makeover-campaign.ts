/**
 * Template d'email pour la campagne "Dubai Négoce fait peau neuf"
 * Envoi à tous les utilisateurs inscrits avec 3 parfums tendance + code promo -5%
 */

export interface CampaignProduct {
  name: string;
  brand: string;
  image: string;
  price: number;
  slug: string;
  shortDescription: string;
}

export function renderMakeoverCampaignEmail(
  userName: string,
  userEmail: string,
  featuredProducts: CampaignProduct[],
  promoCode: string = 'PNEUF5'
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

          /* Header - Nouveau design plus vibrant */
          .header {
            background: linear-gradient(135deg, #d4145a 0%, #fbb034 50%, #d4145a 100%);
            color: white;
            padding: 50px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '✨';
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 30px;
            opacity: 0.3;
          }
          .header::after {
            content: '🌹';
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 30px;
            opacity: 0.3;
          }
          .header h1 {
            font-size: 36px;
            margin-bottom: 10px;
            font-weight: 700;
            position: relative;
            z-index: 1;
          }
          .header p {
            font-size: 17px;
            opacity: 0.98;
            position: relative;
            z-index: 1;
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

          /* Announcement box */
          .announcement {
            background: linear-gradient(135deg, rgba(212, 20, 90, 0.12) 0%, rgba(251, 176, 52, 0.12) 100%);
            border-left: 5px solid #d4145a;
            border-right: 3px solid #fbb034;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .announcement h2 {
            font-size: 20px;
            color: #d4145a;
            margin-bottom: 12px;
          }
          .announcement p {
            margin: 12px 0;
            color: #555;
            line-height: 1.7;
          }

          /* Tendance title */
          .tendance-title {
            font-size: 24px;
            color: #222;
            margin: 35px 0 20px 0;
            text-align: center;
            font-weight: 700;
            position: relative;
          }
          .tendance-title::before {
            content: '🔥';
            margin-right: 8px;
          }
          .tendance-title::after {
            content: '🔥';
            margin-left: 8px;
          }

          /* Products grid */
          .products-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin: 30px 0;
          }

          .product-card {
            background: #f9f9f9;
            border: 2px solid #f0e6f6;
            border-radius: 10px;
            overflow: hidden;
            text-align: center;
            transition: all 0.3s ease;
          }
          .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(212, 20, 90, 0.15);
            border-color: #d4145a;
          }

          .product-image {
            width: 100%;
            height: 160px;
            background: linear-gradient(135deg, #f5e6f3 0%, #ffe6f0 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #999;
            overflow: hidden;
            position: relative;
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
            color: #d4145a;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 5px;
            font-weight: 700;
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
            font-size: 18px;
            font-weight: 700;
            color: #d4145a;
            margin-bottom: 10px;
          }
          .product-cta {
            display: inline-block;
            background: linear-gradient(135deg, #d4145a 0%, #c00d4d 100%);
            color: white;
            padding: 9px 14px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .product-cta:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(212, 20, 90, 0.3);
          }

          /* Promo code section */
          .promo-section {
            background: linear-gradient(135deg, #d4145a 0%, #c00d4d 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin: 35px 0;
          }
          .promo-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
          }
          .promo-code-box {
            background: rgba(255, 255, 255, 0.15);
            border: 2px dashed white;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
          }
          .promo-code {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
            color: #fff;
            margin: 10px 0;
          }
          .promo-description {
            font-size: 13px;
            opacity: 0.95;
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
            padding: 16px 50px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(212, 20, 90, 0.3);
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
              font-size: 28px;
            }
            .promo-code {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🌹 Dubai Négoce fait peau neuf!</h1>
            <p>Venez nous rendre visite en ce moment</p>
          </div>

          <!-- Content -->
          <div class="content">
            <!-- Greeting -->
            <div class="greeting">
              Bonjour <strong>${userName}</strong> 👋
            </div>

            <!-- Announcement -->
            <div class="announcement">
              <h2>✨ Nouvelle ère pour Dubai Négoce</h2>
              <p>
                Nous avons complètement transformé notre univers pour vous offrir une meilleure expérience !
              </p>
              <p>
                Venez découvrir notre nouveau design, une navigation simplifiée et une offre encore plus attrayante.
              </p>
              <p style="font-weight: 600; color: #d4145a;">
                Pour fêter ça avec vous, nous vous offrons <strong>-5% sur votre première commande</strong> ! 🎁
              </p>
            </div>

            <!-- Featured products -->
            <div class="tendance-title">
              Les 3 Tendances du Moment
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

            <!-- Promo Code Section -->
            <div class="promo-section">
              <div class="promo-title">Votre code promo exclusif</div>
              <div class="promo-code-box">
                <div class="promo-code">${promoCode}</div>
                <div class="promo-description">-5% de réduction sur votre commande</div>
              </div>
              <p style="font-size: 12px; margin-top: 12px; opacity: 0.9;">
                À utiliser lors du paiement - Valable sur tous les produits
              </p>
            </div>

            <!-- CTA Principal -->
            <div class="cta-section">
              <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
                Prêt à explorer notre nouvelle plateforme ?
              </p>
              <a href="https://dubainegoce.fr/shop" class="cta-button">
                Commencer ma visite →
              </a>
            </div>

            <!-- Why section -->
            <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
              <p style="font-size: 14px; font-weight: 600; color: #222; margin-bottom: 12px;">
                ✨ Pourquoi vous allez adorer la nouvelle version:
              </p>
              <p style="font-size: 13px; color: #666; margin: 8px 0;">
                ✓ <strong>Interface plus intuitive</strong> - Trouvez vos parfums préférés en un clin d'œil
              </p>
              <p style="font-size: 13px; color: #666; margin: 8px 0;">
                ✓ <strong>Recommandations personnalisées</strong> - Basées sur vos goûts et historique
              </p>
              <p style="font-size: 13px; color: #666; margin: 8px 0;">
                ✓ <strong>Livraison toujours en 48h</strong> - Partout en France métropolitaine
              </p>
              <p style="font-size: 13px; color: #666; margin: 8px 0;">
                ✓ <strong>Tarifs fixes toujours</strong> - 35€ tous nos parfums, sans augmentation
              </p>
            </div>

            <!-- Support section -->
            <div style="margin-top: 30px; padding: 20px; background: #fff9f3; border-radius: 8px;">
              <p style="font-size: 14px; font-weight: 600; color: #222; margin-bottom: 12px;">
                💬 Des questions ?
              </p>
              <p style="font-size: 13px; color: #666; margin-bottom: 10px;">
                Notre équipe est là pour vous ! Contactez-nous par email ou téléphone :
              </p>
              <p style="font-size: 13px; color: #555; margin: 8px 0;">
                📧 <a href="mailto:contact@dubainegoce.fr" style="color: #d4145a; text-decoration: none; font-weight: 500;">contact@dubainegoce.fr</a>
              </p>
              <p style="font-size: 13px; color: #555; margin: 8px 0;">
                📞 <a href="tel:+33780299333" style="color: #d4145a; text-decoration: none; font-weight: 500;">07 80 29 93 33</a>
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
              Vous recevez cet email car vous êtes un client de DubaiNegoce.<br>
              <a href="https://dubainegoce.fr/mentions-legales">Mentions légales</a> •
              <a href="https://dubainegoce.fr/terms">Conditions générales</a>
            </p>
            <div class="footer-divider">|</div>
            <p style="margin-top: 10px;">
              Bienvenue dans la nouvelle ère de Dubai Négoce ! 🌹
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
