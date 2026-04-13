# 🎉 Email de Bienvenue - Guide d'intégration

## Vue d'ensemble

Système automatisé d'email de bienvenue pour les nouveaux utilisateurs DubaiNegoce.

### ✨ Caractéristiques
- ✅ Message personnalisé par prénom
- ✅ Présentation de 3 pépites du moment
- ✅ Tarifs fixes à 35€ (pas de promo, prix transparent)
- ✅ Bénéfices et garanties
- ✅ CTA vers la boutique
- ✅ Design responsive mobile/desktop

---

## 🚀 Utilisation - 3 options

### Option 1: Lors de l'inscription Firebase

**Dans votre page d'inscription** (`src/app/signup/page.tsx`):

```typescript
import { Resend } from 'resend';

// Après création de l'utilisateur Firebase
const newUser = await createUserWithEmailAndPassword(auth, email, password);

// Appeler l'API de bienvenue
const response = await fetch('/api/auth/send-welcome-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: email,
    name: displayName || email.split('@')[0],
    userId: newUser.user.uid
  })
});

if (response.ok) {
  console.log('✅ Email de bienvenue envoyé');
}
```

### Option 2: Via Cloud Function Firebase

**Déclencher automatiquement à l'inscription** (`functions/onUserCreate.js`):

```javascript
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  const response = await fetch(
    'https://votre-app.web.app/api/auth/send-welcome-email',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        userId: user.uid
      })
    }
  );

  console.log('Welcome email sent:', response.ok);
});
```

### Option 3: Via Admin API

```bash
curl -X POST http://localhost:3000/api/auth/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "Jean Dupont",
    "userId": "firebase-uid-123"
  }'
```

---

## 📧 Contenu de l'email

### Sections principales:
1. **Header personnalisé** - Bienvenue + nom du client
2. **Message de bienvenue** - Présentation communauté + remerciements
3. **3 Parfums du moment** - Best-sellers + notés + nouveautés (tous à 35€)
4. **Avantages** - Authentique, livraison 48h, prix fixes, garantie, support, communauté
5. **CTA principal** - "Commencer ma visite olfactive"
6. **Informations contact** - Email support
7. **Footer** - Mentions légales, mentions légales

### Sélection des 3 produits:
```
Critères de priorité:
1. Best-sellers en premier
2. Notation élevée (4.5+)
3. Nouveautés
4. Prix 35€ (standard)
```

---

## 🔌 API Endpoint

### POST `/api/auth/send-welcome-email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "Alain",
  "userId": "firebase-user-id"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email de bienvenue envoyé à user@example.com",
  "emailId": "email_abc123...",
  "user": {
    "name": "Alain",
    "email": "user@example.com",
    "userId": "firebase-user-id"
  },
  "featuredProducts": [
    { "name": "Woody Oud 80ml", "brand": "Maison Alhambra", "price": 35 },
    { "name": "Asad", "brand": "Lattafa", "price": 35 },
    { "name": "Premium Essence", "brand": "Fragrance World", "price": 35 }
  ]
}
```

### GET `/api/auth/send-welcome-email?preview=true`

Voir les produits en vedette pour les nouveaux utilisateurs:

```bash
curl "http://localhost:3000/api/auth/send-welcome-email?preview=true"
```

Response:
```json
{
  "featured_products": [
    {
      "name": "Woody Oud 80ml",
      "brand": "Maison Alhambra",
      "image": "...",
      "price": 35,
      "slug": "woody-oud-80-ml-maison-alhambra",
      "shortDescription": "Essence boisée captivante"
    },
    ...
  ],
  "count": 3
}
```

---

## 📝 Variables d'environnement

```env
# .env.local
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=bienvenue@dubainegoce.fr  # Email d'expédition
NEXT_PUBLIC_APP_URL=https://dubainegoce.fr
```

---

## 🎯 Message clé

> "Tarifs fixes toute l'année - 35€ pour tous nos parfums 80ml, sans surprise"

**Important:**
- ❌ Pas de code promo dans l'email de bienvenue
- ❌ Pas de réduction temporaire
- ✅ Transparence des prix
- ✅ Fidélisation par service & qualité, pas par promo

---

## 🔄 Intégration complète

### Flux d'inscription complet:

```
Utilisateur clique "S'inscrire"
    ↓
Formulaire d'inscription (email, password, nom)
    ↓
Créer compte Firebase Auth
    ↓
Créer document utilisateur Firestore
    ↓
Appeler POST /api/auth/send-welcome-email
    ↓
Email de bienvenue envoyé ✅
    ↓
Redirection vers dashboard / boutique
```

### Code exemple complet:

```typescript
// src/app/signup/page.tsx
async function handleSignup(email: string, password: string, name: string) {
  try {
    // 1. Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // 2. Firestore user doc
    await setDoc(doc(firestore, 'users', userId), {
      email,
      name,
      createdAt: new Date().toISOString(),
      signupSource: 'web'
    });

    // 3. Welcome email
    const response = await fetch('/api/auth/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, userId })
    });

    if (!response.ok) {
      console.warn('⚠️ Welcome email failed:', await response.text());
    }

    // 4. Redirection
    router.push('/shop');
  } catch (error) {
    console.error('Signup error:', error);
  }
}
```

---

## 📊 Suivi & Analytics

### Ajouter dans GTM/GA4:

```javascript
// Lors de l'inscription réussie
gtag('event', 'sign_up', {
  method: 'email',
  event_category: 'authentication',
  event_label: 'new_user_signup'
});

// Lors de l'envoi de l'email de bienvenue
gtag('event', 'welcome_email_sent', {
  event_category: 'email',
  event_label: user_email
});
```

---

## ✅ Checklist d'intégration

- [ ] Créer endpoint API (déjà fait ✅)
- [ ] Ajouter template email (déjà fait ✅)
- [ ] Configurer Resend API key
- [ ] Tester avec email de bienvenue
- [ ] Ajouter au flux d'inscription
- [ ] Tester sur dev puis production
- [ ] Monitorer les envois dans Resend Dashboard
- [ ] Suivre les métriques GA4

---

## 🐛 Dépannage

### Email non envoyé?
1. ✓ Vérifier RESEND_API_KEY configurée
2. ✓ Vérifier domaine FROM_EMAIL autorisé dans Resend
3. ✓ Vérifier les logs serveur
4. ✓ Checker le dashboard Resend pour les rebonds

### Produits incorrects?
```bash
# Prévisualiser les produits en vedette
curl "http://localhost:3000/api/auth/send-welcome-email?preview=true"
```

---

*Email de bienvenue - Version 1.0*
*Dernière mise à jour: 2026-03-08*
