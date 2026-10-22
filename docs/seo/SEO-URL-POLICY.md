# Politique des URL

- Produits : URL actuelle conservée, canonical absolue vers elle-même ; stock nul ne signifie pas suppression de page. Liquid Brun conserve `/parfum/liquide-brun-french-avenue`.
- Catalogue : `/shop/all` est la destination canonique générale. `/shop` conserve sa redirection existante et sort du sitemap.
- Marques : utiliser les routes existantes `/shop/marque/{slug}` pour le maillage. Pas de nouvelle arborescence `/marques`. Marques sans référence : noindex local.
- Genres et familles : routes existantes, canonical dédiée. Préserver les filtres interactifs.
- Combinaisons de filtres `/shop/all?...` : canonical vers `/shop/all` ; pas dans le sitemap. Ne pas les bloquer dans robots pour permettre la lecture du canonical. Les pages de marques dédiées restent les cibles du maillage principal.
- Recherche `q` : noindex, follow en en-tête HTTP ; métadonnées noindex sur `/shop/all?q=...`. Canonical catalogue conservée. Aucune page de recherche ajoutée au sitemap.
- Compte/admin : exclus du sitemap et bloqués à l'exploration ; noindex HTTP également. Les protections de connexion restent nécessaires indépendamment de robots.
- Panier/paiement/connexion/inscription/favoris : explorables pour lecture du noindex HTTP, hors sitemap.
- Pagination : la grille existante affiche le catalogue côté serveur ; aucune nouvelle pagination dans ce lot. Si elle est introduite, chaque page paginée devra être accessible par lien HTML et porter son propre canonical.
- Sitemap : URL indexables choisies, dédoublonnées, pas de faux lastmod. Réintroduire lastmod seulement avec une vraie date d'édition par ressource.
- Redirections : aucune nouvelle règle dans ce lot. Revoir les anciennes avec GSC, en évitant les destinations non équivalentes ; ne pas changer les slugs pour leur seule esthétique.

Après publication autorisée : contrôler la version réellement servie, soumettre le sitemap dans GSC et inspecter accueil, catalogue, cinq marques et produits pilotes. Aucun de ces actes de publication n'a été effectué ici.
