# Base SEO — 22 octobre 2026

Référence du code : commit `763f9607ff3723dac0fcc3cb45fa1b0ef0371e41`. Travail local sur `codex/seo-foundations`, sans publication. Le visuel et les intégrations de paiement ne font pas l'objet d'une refonte dans ce lot.

## Observations vérifiées

- Collecte HTTP publique séquentielle, sans JavaScript ni authentification : `evidence/production-crawl.json`, horodatage UTC dans le fichier. 203 requêtes, 202 réponses finales 200 et une 404 volontaire, aucune erreur réseau enregistrée. Les redirections suivies sont conservées ; un statut final 200 ne signifie pas réponse directe 200.
- Sitemap public : 196 entrées. Présence de `/account`, de `/shop` et de dates de modification uniformément générées par le code. Ces dates ne prouvent pas une modification éditoriale.
- 26 réponses HTML de l'échantillon comportent le nom Dubainegoce plusieurs fois dans leur titre. Les paramètres de catalogue sont inclus dans ce décompte.
- Catalogue et pages de marques : les liens de produits sont absents du HTML initial testé, mais la page Lattafa affiche les produits après JavaScript dans le navigateur. Cela ne démontre pas un échec d'indexation chez Google.
- Source catalogue : 151 références, 88 avec stock positif lors de l'audit, prix de 35 à 50 euros. L'ancienne promesse universelle « prix unique 35 € » est contradictoire. Le nombre de références annoncé auparavant par le propriétaire était approximatif.
- Product JSON-LD : prix issu du catalogue ; MPN construit à partir d'une référence interne, poids fixe et expiration d'offre calculée artificiellement. Suppression locale de ces champs non justifiés.

## Limites

Aucune donnée Search Console, GA4, Merchant Center, historique de classement ou de backlinks n'a été obtenue. Aucun score Lighthouse, CrUX ou Core Web Vitals n'est mesuré ici. Pas de score SEO global fabriqué. Les statuts HTTP ne prouvent ni indexation ni accessibilité de toutes les images.

Les mesures de revenus, de clics et d'impressions restent à établir. Aucun résultat commercial ou gain de position ne peut être attribué à ces changements.

## Mesure à obtenir

Search Console : exports 16 mois, puis 90 et 28 jours comparables ; France, appareil, pages et requêtes ; distinction marque boutique / marques fabricants / hors marque. Examiner aussi indexation et inspection des URL prioritaires. GA4 : sessions organiques, parcours produit-panier-paiement, achats et revenu ; vérifier la déduplication `transaction_id`, exclure les essais. Merchant Center : diagnostics réels et concordance du flux avec le paiement. Aucun mot de passe ni secret ne doit figurer dans les rapports.
