# Audit priorisé

État : premier lot local, 22 octobre 2026. Preuves publiques et locales dans `evidence/`. Les constats ci-dessous distinguent correction technique et performance commerciale non mesurée.

| Priorité | Constat et conséquence | Action / fichiers | État |
|---|---|---|---|
| P0 | Prix unique affiché malgré plusieurs prix réels | Copie neutre dans layout, accueil, hero, header, footer et catalogue ; aucun prix changé | Corrigé localement |
| P0 | Champs produit non démontrés : MPN interne, poids fixe, échéance automatique | `src/app/parfum/[slug]/page.tsx`, suppression de ces champs ; images absolues | Corrigé localement |
| P0 | Flux Google : livraison calculée au poids estimé et transporteur non disponible | `src/app/api/google-feed/route.ts`, même règle et méthodes que le panier | Corrigé localement, acceptation Merchant Center non vérifiée |
| P1 | Absence de produits et parfois H1 dans HTML initial des catégories | `src/app/shop/layout.tsx` dynamique, maintien des composants interactifs existants | Corrigé localement ; coût serveur à surveiller |
| P1 | Suffixe de titre doublé | Métadonnées des pages shop, blog, FAQ ; template racine conservé | Corrigé localement |
| P1 | Liens de marques vers des filtres plutôt que leur page dédiée | `src/lib/catalog-urls.ts`, header, accueil, fiche produit | Corrigé localement |
| P1 | Sitemap contenant compte et URL redirigée ; dates artificielles | `src/app/sitemap.ts`, retrait compte et lastmod non fiables, ajout Paris Corner, dédoublonnage | Corrigé localement |
| P1 | Politique robots distincte selon agents ; recherche interne indexable | `public/robots.txt`, middleware et métadonnées de recherche | Corrigé localement, pas un contrôle de sécurité |
| P1 | Liens Frais/Musc ne correspondent pas aux valeurs exactes | Header : Hespéridé/Musqué | Corrigé localement |
| P1 | Nom « Liquide Brun » | Nom visible corrigé en Liquid Brun ; URL historique conservée | Fabricant vérifié, pyramide non validée |
| P1 suivant | Descriptions, durée/intensité calculées et textes blog pouvant revendiquer des essais non prouvés | `src/lib/data.ts`, articles, `public/llms*.txt` : inventaire et vérification de sources avant réécriture | À traiter ; aucune note olfactive inventée |
| P2 | Redirections héritées parfois génériques et chaînes possibles | `next.config.mjs`, middleware : rapprocher des URL et données GSC avant toute modification | Non modifié dans ce lot |
| P2 | Contact sans H1 dans HTML public ; pages institutionnelles héritant de métadonnées génériques | Audit des pages institutionnelles et de leur contenu réel | À traiter |
| P2 | Images et performances non mesurées sur appareil réel | Mesures PageSpeed/CrUX, poids, dimensions, LCP/INP/CLS | À mesurer |

Les avis Trustpilot de la boutique ne sont pas convertis en notes produits. Aucun avis, classement, volume de recherche ni témoignage n'a été ajouté. Les corrections n'établissent pas que Google explorait mal le site : c'est une hypothèse à contrôler dans Search Console.

Sources de référence consultées le 22/10/2026 : [canonicals Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [URL e-commerce Google](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites), [Liquid Brun fabricant](https://frenchavenue.com/products/liquid-brun).
