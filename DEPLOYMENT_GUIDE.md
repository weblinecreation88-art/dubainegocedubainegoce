# Guide de Déploiement - DubaiNegoce E-commerce

## 🎉 Statut du Déploiement

Votre e-commerce DubaiNegoce est **DÉPLOYÉ ET ACCESSIBLE** !

### URLs d'accès

- **URL Cloud Run (principale)**: https://dubainegocedubainegoce-sdqwypiwxa-ez.a.run.app
- **URL App Hosting**: https://dubainegocedubainegoce--dubainegoce-227c3.europe-west4.hosted.app (peut prendre quelques minutes à se propager)

## ✅ Configuration Complétée

### 1. Projet Firebase
- **Projet ID**: `dubainegoce-227c3`
- **Région**: `europe-west4` (Pays-Bas - optimal pour la France)
- **Services activés**:
  - ✅ Firebase Authentication (Email/Password)
  - ✅ Cloud Firestore
  - ✅ Cloud Storage
  - ✅ Firebase App Hosting

### 2. Secrets Google Cloud Secret Manager
Les secrets suivants sont configurés dans `europe-west4`:

| Secret | Description | Status |
|--------|-------------|--------|
| `STRIPE_SECRET_KEY` | Clé secrète Stripe Live | ✅ Configuré |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe | ✅ Configuré |
| `SENDGRID_API_KEY` | Clé API SendGrid | ✅ Configuré |

### 3. Variables d'Environnement Publiques
Configurées dans `apphosting.yaml`:

```yaml
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_live_51SjlzeAIq9NC7F5a...
- NEXT_PUBLIC_APP_URL: https://dubainegoce.fr
- FROM_EMAIL: contact@dubainegoce.fr
- GEMINI_API_KEY: AIzaSyCCZ3zqMJ-h8sWzV1Cy0FzUIk91sd4ZLow
```

### 4. Règles de Sécurité
- ✅ **Firestore Rules**: Déployées (sécurisation des données utilisateurs)
- ✅ **Storage Rules**: Déployées (accès authentifié uniquement)

### 5. Permissions Cloud Run
- ✅ **Invocations publiques**: Autorisées (`allUsers` peut invoquer le service)

## 🔧 Configuration Stripe Requise

### Étape Importante: Configurer le Webhook Stripe

1. Connectez-vous à votre dashboard Stripe: https://dashboard.stripe.com/webhooks

2. Cliquez sur **"Ajouter un point de terminaison"**

3. Entrez l'URL du webhook:
   ```
   https://dubainegocedubainegoce-sdqwypiwxa-ez.a.run.app/api/stripe/webhook
   ```

4. Sélectionnez les événements à écouter:
   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`

5. Copiez la **clé de signature du webhook** (commence par `whsec_...`)

6. **Si la clé change**, mettez à jour le secret:
   ```bash
   echo -n "NOUVELLE_CLE_WEBHOOK" | gcloud secrets versions add STRIPE_WEBHOOK_SECRET --data-file=-
   ```

## 🧪 Tests Recommandés

### 1. Test de l'Authentification

**Option A: Utiliser le fichier de test**
```bash
# Ouvrir le fichier de test dans le navigateur
start test-auth.html
```

**Option B: Utiliser le site déployé**
1. Visitez: https://dubainegocedubainegoce-sdqwypiwxa-ez.a.run.app/signup
2. Créez un compte de test
3. Vérifiez que vous pouvez vous connecter
4. Vérifiez dans Firebase Console: https://console.firebase.google.com/project/dubainegoce-227c3/authentication/users

### 2. Test des Paiements Stripe

1. Visitez la boutique: https://dubainegocedubainegoce-sdqwypiwxa-ez.a.run.app/shop
2. Ajoutez un produit au panier
3. Procédez au paiement
4. Utilisez une carte de test Stripe:
   - **Numéro**: `4242 4242 4242 4242`
   - **Date**: N'importe quelle date future
   - **CVC**: N'importe quel 3 chiffres
   - **ZIP**: N'importe quel code postal

5. Vérifiez que la commande apparaît dans:
   - Firebase Console (collection `orders`)
   - Stripe Dashboard

### 3. Test des Emails SendGrid

1. Complétez une commande
2. Vérifiez que l'email de confirmation est envoyé
3. Consultez les logs SendGrid si nécessaire

## 🚀 Workflow de Déploiement

### Déploiement Automatique

Chaque fois que vous poussez vers la branche `master`, Firebase App Hosting:

1. Détecte le nouveau commit
2. Construit l'application avec Docker
3. Déploie automatiquement sur Cloud Run
4. Met à jour l'URL de production

### Commandes Utiles

```bash
# Vérifier le projet actuel
firebase use

# Voir les backends
firebase apphosting:backends:list

# Déployer manuellement les règles
firebase deploy --only firestore:rules
firebase deploy --only storage

# Voir les logs Cloud Run
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dubainegocedubainegoce" --limit 50 --project=dubainegoce-227c3

# Lister les services Cloud Run
gcloud run services list --project=dubainegoce-227c3
```

## 🌐 Configuration du Domaine Personnalisé (Optionnel)

Pour utiliser `dubainegoce.fr`:

1. Allez dans Firebase Console > Hosting
2. Ajoutez un domaine personnalisé
3. Suivez les instructions pour configurer les DNS
4. Mettez à jour `NEXT_PUBLIC_APP_URL` dans `apphosting.yaml`

## 📊 Monitoring

### Logs et Métriques

- **Firebase Console**: https://console.firebase.google.com/project/dubainegoce-227c3/overview
- **Cloud Run Metrics**: https://console.cloud.google.com/run?project=dubainegoce-227c3
- **Firestore Data**: https://console.firebase.google.com/project/dubainegoce-227c3/firestore
- **Authentication Users**: https://console.firebase.google.com/project/dubainegoce-227c3/authentication/users

## 🔒 Sécurité

### Secrets Sensibles

❌ **NE JAMAIS** committer:
- `.env.local`
- Clés API
- Secrets Stripe
- Credentials Firebase

✅ **Toujours** utiliser:
- Google Cloud Secret Manager pour les secrets en production
- Variables d'environnement locales pour le développement
- `.gitignore` pour exclure les fichiers sensibles

### Recommandations

1. **Activez 2FA** sur vos comptes Firebase, Google Cloud et Stripe
2. **Limitez les permissions** des clés API
3. **Surveillez les logs** régulièrement pour détecter les activités suspectes
4. **Mettez à jour** régulièrement les dépendances

## 🆘 Dépannage

### Le site retourne 403 Forbidden

**Solution**: Autoriser les invocations non authentifiées
```bash
gcloud run services add-iam-policy-binding dubainegocedubainegoce \
  --region=europe-west4 \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --project=dubainegoce-227c3
```

### Erreur "Configuration du serveur incomplète" lors du checkout

**Cause**: Les variables d'environnement secrètes ne sont pas montées sur Cloud Run

**Solution**: Monter les secrets manuellement
```bash
gcloud run services update dubainegocedubainegoce \
  --region=europe-west4 \
  --project=dubainegoce-227c3 \
  --update-secrets=STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest,SENDGRID_API_KEY=SENDGRID_API_KEY:latest
```

### Les webhooks Stripe ne fonctionnent pas

**Vérifications**:
1. L'URL du webhook est correcte
2. Le `STRIPE_WEBHOOK_SECRET` correspond à celui de Stripe
3. Les événements corrects sont sélectionnés
4. Consultez les logs Stripe pour voir les erreurs

### Les utilisateurs ne peuvent pas s'inscrire

**Vérifications**:
1. Email/Password est activé dans Firebase Authentication
2. Les règles Firestore permettent la création de documents utilisateurs
3. Le projet Firebase est correct dans `firebase/config.ts`

### Build échoue

**Vérifications**:
1. `next.config.mjs` a `output: 'standalone'`
2. Toutes les dépendances sont dans `package.json`
3. Pas d'erreurs TypeScript (`npm run typecheck`)

## 📝 Checklist de Mise en Production

- [x] Projet Firebase configuré
- [x] Secrets configurés dans Google Cloud
- [x] Règles Firestore/Storage déployées
- [x] Application déployée sur Cloud Run
- [x] Permissions publiques configurées
- [ ] Webhook Stripe configuré
- [ ] Tests d'authentification effectués
- [ ] Tests de paiement effectués
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Monitoring activé
- [ ] Sauvegardes configurées

## 📞 Support

- **Firebase Support**: https://firebase.google.com/support
- **Stripe Support**: https://support.stripe.com
- **Documentation Next.js**: https://nextjs.org/docs

---

**Date de déploiement**: 2026-01-03
**Version**: 1.0.0
**Environnement**: Production
