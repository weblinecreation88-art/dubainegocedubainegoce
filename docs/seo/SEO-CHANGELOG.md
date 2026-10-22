# Journal du premier lot

22/10/2026 — `codex/seo-foundations`, base `763f960`. Aucun push ou déploiement de ce lot.

- Catalogue : rendu serveur via layout shop dynamique, filtres clients conservés ; un H1 visible.
- Titres : retrait du suffixe manuel lorsque le template l'ajoute déjà.
- Copie : retrait de la promesse universelle 35 €, sans changement des prix ; retrait du délai 48 h dans la description catalogue.
- Maillage : helper de routes marques, liens du header/accueil/fiche ; filtres Hespéridé et Musqué corrigés.
- Liquid Brun : orthographe fabricant dans les données, slug et identifiant inchangés.
- Product : suppression MPN artificiel, poids et expiration automatique ; images absolues et livraison utilisant la règle métier existante.
- Flux Google : méthodes de livraison réellement disponibles et tarif de panier pour un article ; suppression de identifier_exists=false non établi.
- Sitemap : catalogue canonique, compte et mentions légales déjà noindex retirés, Paris Corner ajouté, dédoublonnage ; lastmod omis faute de vraies dates de révision.
- Robots : mêmes exclusions privées pour agents autorisés ; noindex des pages utilitaires et recherches internes.
- Ajout de scripts HTTP et de régression, preuves et documentation dans `docs/seo`.

Retour arrière : les changements ne sont pas publiés. Pour préparer un retour arrière futur, utiliser le diff de cette branche contre `763f960` et annuler seulement les fichiers du lot ; conserver les changements utilisateur de `.claude/launch.json` et les prototypes non suivis. Ne pas faire de reset global. Aucun changement de règle de paiement, prix, stock, image, ID ou URL produit.
