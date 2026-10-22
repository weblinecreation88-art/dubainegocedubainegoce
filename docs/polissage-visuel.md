# DubaiNegoce — Polissage du site existant

Travail local sur `codex/aeration-boutique`, depuis `fabd5a9` (version Gemini récupérée sur origin/main). Aucun déploiement ou push. La modification préexistante de `.claude/launch.json` et les anciennes maquettes ont été conservées.

## Corrections visuelles

1. Espacement régulier entre les sections d'accueil.
2. Cadres et ombres allégés, sans changer les couleurs ou les images.
3. Séparateurs dorés plus fins et titres plus lisibles.
4. Photos produits avec des marges homogènes et cinq colonnes sur grand écran.
5. Noms, contenances et informations alignés sur les cartes.
6. Prix sans retour à la ligne ; disponibilité sur sa propre ligne.
7. Boutons de hauteur constante.
8. En-tête mobile compact, non fixé pendant le défilement ; conseiller positionné au-dessus des cookies.
9. Livraison, paiement et vendeur conservés dans des blocs moins encadrés.
10. Footer plus lisible, liens plus faciles à toucher et accordéons conservés.

Le catalogue passe à deux colonnes sur mobile. La fiche produit conserve ses trois colonnes sur ordinateur, avec prix insécable et bloc d'achat assoupli.

## Fichiers

- `src/app/storefront-polish.css` : règles de présentation ciblées.
- `src/app/layout.tsx`, `src/app/page.tsx` : branchement des styles et classes de portée.
- `src/components/layout/{header,hero-banner,footer}.tsx` : classes de portée, identité et fonctionnalités conservées.
- `src/components/product/product-card.tsx`, `src/components/shop/product-grid.tsx`, `src/app/parfum/[slug]/page.tsx` : cartes, grille mobile et prix.
- `src/components/cookie-consent.tsx`, `src/components/faq-chatbot.tsx` : positionnement coordonné.

## PayPal et avis — demande complémentaire

- PayPal retiré du panier, des badges et des mentions visibles dans l'accueil, la bannière, le récapitulatif et la page livraison/paiement.
- `src/app/api/paypal/{create-order,capture-order}/route.ts` renvoient HTTP 410 sans contacter PayPal. Stripe conservé.
- Témoignages statiques et faux avis de `src/lib/trustpilot-client.ts` supprimés.
- Composants d'avis remplacés par un lien vers le profil Trustpilot réel ; aucune note de boutique présentée comme une note produit.
- Agrégation automatique supprimée de `src/components/seo/schemas.ts`.

## Vérifications réalisées

- TypeScript : `tsc --noEmit --incremental false` réussi après les changements.
- `git diff --check` : aucune erreur d'espacement ; avertissements Windows de normalisation des fins de ligne.
- Next.js : compilation et consultation locales de l'accueil, du catalogue filtré, de la fiche et du panier.
- Navigateur : captures accueil à 390 × 844 et 1440 × 1000 ; aucun débordement horizontal détecté aux contrôles finaux.
- Onglets sélection/nouveautés ; navigation catalogue/fiche ; ajout au panier au clavier, confirmation à 42,10 € (35 € + 7,10 €), puis panier de test vidé.
- DOM contrôlé : aucune mention PayPal sur accueil/catalogue/fiche ; aucun aggregateRating/reviewCount dans le JSON-LD de la fiche Khamrah.
- Routes PayPal testées localement : 410 pour création et capture.
- Images de comparaison : `public/apercus/polissage/comparaison.html`.

## Limites

ESLint demande encore une configuration initiale : lint non validé. Aucun paiement Stripe réel, test d'authentification ou audit de performance complet. Pas de compilation de production validée dans cette passe ; la vérification du rendu utilise le serveur de développement. Les tarifs, prix et autres règles commerciales n'ont pas été modifiés. Le carrousel et les éléments différés peuvent être dans des états différents sur les captures avant/après.
