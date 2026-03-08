# 🔥 Firebase App Hosting - Guide de déploiement

## Configuration pour Firebase (pas Vercel)

Ce projet utilise **Firebase App Hosting** avec **Next.js**. Voici comment configurer les services critiques.

---

## 📧 Cron Jobs - Email Reminders (Day 3 & 7)

### Endpoint API
- **Route**: `/api/cron/abandoned-cart-reminders`
- **Méthode**: POST
- **Authentification**: Bearer token (CRON_SECRET)
- **Fonctionnalité**: Envoie emails de rappel pour paniers abandonnés

### Configuration sur Google Cloud Scheduler

Puisque Firebase App Hosting ne supporte pas les Vercel Crons, utilisez **Google Cloud Scheduler** :

#### **Étape 1: Activer Google Cloud Scheduler**
```bash
# Dans Google Cloud Console
gcloud services enable cloudscheduler.googleapis.com
```

#### **Étape 2: Créer le job cron**
```bash
gcloud scheduler jobs create http abandoned-cart-reminders \
  --location=europe-west1 \
  --schedule="0 10 * * *" \
  --http-method=POST \
  --uri="https://votre-app.web.app/api/cron/abandoned-cart-reminders" \
  --oidc-service-account-email=YOUR_SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com \
  --oidc-token-audience="https://votre-app.web.app"
```

#### **Étape 3: Ajouter l'authentification**
Si vous utilisez CRON_SECRET, passez-le en header :
```bash
gcloud scheduler jobs create http abandoned-cart-reminders \
  --location=europe-west1 \
  --schedule="0 10 * * *" \
  --http-method=POST \
  --uri="https://votre-app.web.app/api/cron/abandoned-cart-reminders" \
  --headers="Authorization=Bearer YOUR_CRON_SECRET" \
  --oidc-service-account-email=YOUR_SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com
```

### Variables d'environnement requises

```env
# .env.local (Firebase App Hosting)
RESEND_API_KEY=re_xxxxx           # Clé API Resend pour emails
FROM_EMAIL=contact@dubainegoce.fr # Email d'expédition
CRON_SECRET=your_secret_key       # Token de sécurité pour cron jobs
NEXT_PUBLIC_APP_URL=https://dubainegoce.fr
```

---

## 🔥 Firebase Configuration

### Firestore Setup
```javascript
// Collections requises:
- /users/{userId}/abandoned_carts
- /users/{userId}/orders
```

### Storage (Optionnel)
Firebase Storage est déjà configuré dans le projet pour les images.

---

## 📊 Analytics & Conversion Tracking

### Google Tag Manager (GTM)
- Intégré via `src/context/cart-context.tsx`
- Suivi événements ecommerce: `view_item`, `add_to_cart`, `purchase`
- Compatible avec Firebase Analytics

### Firebase Analytics
Events suivis automatiquement via GTM dataLayer.

---

## 🚀 Déploiement sur Firebase App Hosting

### 1. Installer Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialiser le projet
```bash
firebase init hosting
```

### 3. Configurer firebase.json
```json
{
  "hosting": {
    "public": ".next",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4. Déployer
```bash
npm run build
firebase deploy --only hosting
```

---

## ✅ Services Opérationnels

| Service | Framework | Status | Notes |
|---------|-----------|--------|-------|
| Web App | Next.js | ✅ | Déployé sur Firebase App Hosting |
| Database | Firestore | ✅ | Configuré |
| Email Crons | Cloud Scheduler | ✅ | À configurer dans GCP Console |
| Analytics | Google Analytics 4 | ✅ | Via GTM |
| Authentication | Firebase Auth | ✅ | Optionnel |
| Storage | Firebase Storage | ✅ | Pour images produits |

---

## 🔗 Ressources

- **Firebase Hosting Docs**: https://firebase.google.com/docs/hosting/quickstart
- **Cloud Scheduler Docs**: https://cloud.google.com/scheduler/docs
- **Next.js on Firebase**: https://firebase.google.com/docs/hosting/frameworks/frameworks-nextjs

---

## 📝 Notes importantes

- ❌ **Ne pas utiliser**: Vercel Crons, Vercel Analytics
- ✅ **Utiliser**: Firebase App Hosting, Google Cloud Scheduler, Google Analytics 4
- 🔑 **Secrets**: Stockez toutes les clés dans Cloud Secret Manager ou variables d'env Firebase

---

*Dernière mise à jour: 2026-03-08*
