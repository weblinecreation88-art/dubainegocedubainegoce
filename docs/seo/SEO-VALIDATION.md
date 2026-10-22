# Contrôles du premier lot

Date : 22/10/2026. Environnement local compilé Next.js 14.2.35, port 3001. Les preuves HTTP sont des lectures sans JavaScript ; les contrôles navigateur sont distincts.

## Vérifications exécutées

- `npm run typecheck` : réussi indépendamment du build. La configuration historique du build ignore types et lint ; son succès ne remplace pas ce contrôle.
- `npm run build` : compilation et génération de 260 pages réussies. Avertissements OpenTelemetry/Genkit et Browserslist préexistants ; pas présentés comme corrigés.
- `npm run lint` avec entrée non interactive : non exécuté au fond, demande initiale de configuration ESLint. Aucun nouvel outil installé ; aucune configuration imposée.
- `node scripts/seo-http-audit.mjs --base http://localhost:3001 --output docs/seo/evidence/local-after.json` : échantillon de 17 URL compilées. Catalogue : 151 liens produits dans le HTML initial ; cinq marques : 43, 47, 14, 23 et 8 liens. Un H1 sur chaque catégorie vérifiée. Recherche interne : noindex HTTP et HTML. URL inexistante : 404.
- Même script avec `--sitemap --output docs/seo/evidence/local-crawl.json` : 195 destinations du sitemap vérifiées en 200 direct, sans noindex. Statuts, éventuelles redirections, métadonnées et JSON-LD archivés.
- `node scripts/seo-regression.cjs` : comparaison avec `763f960`, champs commerciaux et images inchangés pour 151 produits ; prix/stock du flux et du JSON-LD comparés au catalogue ; sitemap sans URL noindex ou redirection. Résultat final dans `evidence/regression.json`.
- `git diff --check` : sans erreur d'espacement.

## Navigateur

- Bureau 1280 px : Lattafa, titre unique, H1 « Parfums Lattafa », 43 liens produits, aucun débordement horizontal détecté.
- Mobile 390 × 844 : fiche Liquid Brun, photographie réelle, prix 44,99 €, marque liée à sa page canonique ; largeur du contenu ne dépassant pas la fenêtre.
- Ajout d'un Liquid Brun : confirmation, panier à 44,99 € + 7,10 € = 52,09 € ; ouverture du formulaire de livraison sans transaction et sans coordonnées saisies. Article de test retiré ensuite, panier vide confirmé.
- La validation s'arrête avant tout paiement externe, création de commande, envoi d'e-mail ou appel de webhook. L'authentification et les achats réels ne sont pas déclarés testés.

## Reste à faire

1. Vérification éditoriale sourcée des notes et performances produits, avec Fragrantica.fr exact et fabricant. Le pilote actuel valide seulement le nom Liquid Brun. Les anciennes descriptions comportent encore des promesses de tenue non démontrées.
2. Métadonnées et canonicals de pages blog/institutionnelles : 17 pages de l'échantillon local complet restent sans canonical explicite ; inventaire dans le JSON. Ce n'est pas une nouvelle régression du lot.
3. Mesures réelles GSC/GA4/Merchant Center/CrUX ; ni classement ni revenu ni score de performance annoncé.
4. Vérification après déploiement, inspection Google et acceptation du flux. Les dates de modification restent omises faute de dates fiables.

Prêt à relire localement ; aucun push ni déploiement de ce lot. La décision de publication revient au propriétaire. Les fichiers `.claude/launch.json` et les anciens prototypes non suivis n'appartiennent pas au lot.
