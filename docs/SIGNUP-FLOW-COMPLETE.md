# 📝 Flux d'inscription complet avec Email de Bienvenue

## Vue d'ensemble

Flux d'inscription amélioré qui envoie automatiquement un email de bienvenue avec 3 pépites du moment.

---

## 🎯 Flux utilisateur (User Journey)

```
1. Utilisateur clique "Créer un compte" ou "S'inscrire"
   ↓
2. Remplit le formulaire (Nom, Email, Mot de passe)
   ↓
3. Valide le formulaire (validation Zod côté client)
   ↓
4. Clique "Créer mon compte"
   ↓
5. 🔄 Côté serveur:
   a) Crée compte Firebase Auth
   b) Met à jour profil utilisateur (displayName)
   c) Crée document Firestore `users/{uid}`
   d) 📧 Appelle /api/auth/send-welcome-email
   ↓
6. ✅ Redirection vers accueil
7. 📬 Email de bienvenue reçu (quelques secondes)
```

---

## 📧 Qu'envoie l'email de bienvenue?

### Contenu:
- ✅ Salutation personnalisée (Prénom de l'utilisateur)
- ✅ Message de bienvenue communauté
- ✅ 3 parfums du moment (auto-sélectionnés)
- ✅ Avantages DubaiNegoce
- ✅ Outils personnels (profil, suivi commandes, wishlist)
- ✅ Support: email + téléphone
- ✅ CTA: "Commencer ma visite olfactive"

### Quand?
- **Timing**: Immédiatement après création du compte (async, non-bloquant)
- **Délai réel**: 5-10 secondes (temps d'envoi email)

### Sélection des 3 produits:
```
Critères (dans cet ordre):
1. Prix = 35€ (standard)
2. Best-sellers en priorité
3. Notation élevée (4.5+)
4. Nouveautés
5. Aléatoire si pas assez
```

---

## 🔧 Architecture technique

### Page d'inscription
**Fichier**: `src/app/signup/page.tsx`

```typescript
async function onSubmit(values) {
  // 1. Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // 2. Update profile
  await updateProfile(user, { displayName: name });

  // 3. Firestore user doc
  setDocumentNonBlocking(userDocRef, userData, { merge: true });

  // 4. 📧 NOUVEAU: Envoyer email de bienvenue
  await fetch('/api/auth/send-welcome-email', {
    method: 'POST',
    body: JSON.stringify({ email, name, userId: user.uid })
  });

  // 5. Redirection
  router.push('/');
}
```

### API Endpoint
**Fichier**: `src/app/api/auth/send-welcome-email/route.ts`

```
POST /api/auth/send-welcome-email
Headers: Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "name": "Jean Dupont",
  "userId": "firebase-uid"
}

Response:
{
  "success": true,
  "message": "Email de bienvenue envoyé...",
  "emailId": "email_xxx",
  "featuredProducts": [...]
}
```

### Template Email
**Fichier**: `src/lib/email-templates/welcome-new-user.ts`

---

## 📊 Validation des données

### Validation côté client (React Hook Form + Zod)
```typescript
const formSchema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Au moins 6 caractères'),
});
```

### Validation côté serveur (Firebase)
- Email unique (Firebase vérifie)
- Mot de passe sécurisé (6+ caractères)
- Pas de doublons

---

## 🚨 Gestion des erreurs

### Si création de compte échoue:
```
- Email déjà utilisé → "Cette adresse email est déjà utilisée."
- Autre erreur → "Une erreur est survenue. Veuillez réessayer."
```

### Si email de bienvenue échoue:
```
- ⚠️ Log en console: "Email de bienvenue non envoyé"
- Ne pas bloquer l'inscription (async, non-bloquant)
- Utilisateur peut quand même accéder à son compte
- Email sera peut-être envoyé après quelques minutes
```

---

## ✅ Checklist d'intégration

- [x] Page d'inscription créée
- [x] Formulaire avec validation Zod
- [x] Firebase Auth intégré
- [x] Firestore user doc créé
- [x] Email de bienvenue API créé ✅ NOUVEAU
- [x] Email de bienvenue intégré dans signup ✅ NOUVEAU
- [ ] Tester en dev local
- [ ] Tester en prod
- [ ] Vérifier emails dans Resend Dashboard
- [ ] Monitorer GA4 pour inscriptions

---

## 🧪 Test local

### 1. Démarrer le serveur dev
```bash
npm run dev
```

### 2. Aller à `http://localhost:3000/signup`

### 3. Remplir le formulaire
```
Nom: Jean Dupont
Email: test@example.com
Mot de passe: password123
```

### 4. Cliquer "Créer mon compte"

### 5. Vérifier:
- ✅ Redirection vers accueil
- ✅ Toast "Compte créé avec succès"
- ✅ Email de bienvenue dans logs serveur
- ✅ Email de bienvenue dans Resend Dashboard

---

## 📧 Configuration requise

```env
# .env.local
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=bienvenue@dubainegoce.fr
NEXT_PUBLIC_APP_URL=https://dubainegoce.fr
```

---

## 🎯 Métriques & Analytics

### Ajouter au GTM/GA4:

```javascript
// Lors de l'inscription réussie
gtag('event', 'sign_up', {
  method: 'email',
  event_category: 'authentication',
  event_label: email
});

// Lors de l'envoi de l'email de bienvenue
gtag('event', 'welcome_email_sent', {
  event_category: 'email',
  event_label: 'new_signup'
});
```

---

## 🔐 Sécurité

### Points de sécurité:
- ✅ Validation Zod côté client
- ✅ Firebase Auth pour les mots de passe
- ✅ Emailhygiène (Resend valide les emails)
- ✅ CORS protégé pour l'API
- ✅ Erreurs génériques (pas d'info sensibles)
- ✅ Rate limiting recommandé (Firestore limits)

---

## 🚀 Améliorations futures

1. **Confirmation email** - Ajouter vérification email avant compte actif
2. **SMS bienvenue** - Envoyer SMS optionnel avec code promo
3. **Double opt-in** - Permettre refuser les emails marketing
4. **Onboarding email series** - Email jour 1, 3, 7 avec conseils
5. **Referral program** - Email bienvenue avec lien de parrainage
6. **Progressive profiling** - Demander infos progressivement

---

## 📞 Support et troubleshooting

### Email ne s'envoie pas?
1. ✓ Vérifier RESEND_API_KEY configurée
2. ✓ Vérifier domaine FROM_EMAIL autorisé
3. ✓ Vérifier logs serveur
4. ✓ Vérifier Resend Dashboard pour les rebonds

### Utilisateur ne reçoit pas?
1. ✓ Vérifier dossier spam/promotions
2. ✓ Vérifier le domaine de l'email
3. ✓ Resend a-t-il marqué comme invalide?

### Inscription bloquée?
1. ✓ Vérifier Firebase errors
2. ✓ Vérifier validation formulaire
3. ✓ Vérifier email unique

---

## 📝 Notes de développement

- Email d'inscription est **non-bloquant**: si l'email échoue, l'inscription réussit quand même
- Les utilisateurs peuvent créer plusieurs comptes avec le même email (géré par Firebase)
- Les 3 produits varient selon les données Firestore
- L'email est envoyé **immédiatement** après création du compte
- Pas de confirmation d'email requise (à ajouter si besoin)

---

*Flux d'inscription - Version 1.0*
*Dernière mise à jour: 2026-03-08*
