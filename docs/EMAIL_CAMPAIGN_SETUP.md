# 📧 Configuration Email - Resend + Gmail Fallback

## 🎯 Architecture

```
┌─────────────────────────────────────┐
│ Campagne Email                      │
└──────────────┬──────────────────────┘
               │
      ┌────────▼────────┐
      │ RESEND (Primary)│  ← Professionnel, suivi, illimité
      └────────┬────────┘
               │
         [Succès?]
        /        \
      OUI        NON
       │          │
       ✅        ▼
          ┌──────────────────┐
          │ GMAIL (Fallback) │ ← Backup, gratuit, 500/jour
          └──────────────────┘
```

---

## 🚀 Setup Resend (Primary)

### 1. Créer compte Resend
1. Aller à https://resend.com
2. S'inscrire avec ton email
3. Créer une API key

### 2. Vérifier le domaine
1. Dans Resend Dashboard → Domains
2. Ajouter `dubainegoce.fr`
3. Vérifier les DNS records (ajouter les SPF, DKIM, DMARC)
4. Une fois vérifié, configurer `FROM_EMAIL=campagne@dubainegoce.fr`

### 3. Ajouter à `.env.local`
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=campagne@dubainegoce.fr
```

---

## 💻 Setup Gmail Fallback

### Étape 1: Activer 2FA sur Gmail
1. Aller à https://myaccount.google.com/security
2. Cliquer "Vérification en 2 étapes"
3. Suivre les instructions (verif par SMS ou app)
4. Confirmer une fois activée

### Étape 2: Générer App Password
1. Aller à https://myaccount.google.com/apppasswords
2. Sélectionner:
   - Mail
   - Windows Computer (ou Other)
3. Copier le **mot de passe généré** (16 caractères)

### Étape 3: Ajouter à `.env.local`
```bash
GMAIL_USER=abderelmalki@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

⚠️ **IMPORTANT**:
- Garder l'App Password secret (comme une clé API)
- **NE PAS** le mettre en git
- Le `.env.local` est dans `.gitignore`

---

## 📋 Créer Groupe Gmail pour les Utilisateurs

### Via Google Workspace Admin Console

1. Aller à https://admin.google.com
2. Naviguer vers "Groupes"
3. Créer nouveau groupe:
   - **Nom**: `dubainegoce-users`
   - **Email**: `dubainegoce-users@groups.google.com`
   - **Type**: Groupe de distribution
   - **Public/Private**: Private

4. Ajouter les utilisateurs:
   - Membre statique OU Requête LDAP (à partir d'une export CSV)
   - CSV format: `email,firstName,lastName`

### Via Google Groups (gratuit)

1. Aller à https://groups.google.com
2. "Créer un groupe"
3. Nom: `dubainegoce-users`
4. Ajouter les utilisateurs manuellement ou par CSV

---

## 🧪 Test Email

### Test via Admin Page
1. Aller à `/admin/campaigns`
2. Cliquer "📧 Envoyer un test"
3. Entrer ton email
4. Le système essayera **Resend** d'abord, puis **Gmail** en fallback

### Voir les logs
- Ouvrir Firebase Console → Firestore
- Collection `emailLogs`
- Vérifier le champ `method` ("resend" ou "gmail")

---

## 📊 Monitoring

### Tracking des envois
- **Collection Firestore**: `emailLogs`
- **Champs**:
  - `email`: destinataire
  - `method`: "resend" ou "gmail"
  - `status`: "sent"
  - `sentAt`: timestamp

### Dashboard Admin
- Page `/admin/campaigns` show:
  - ✅ Envoyés via Resend
  - ⚠️ Fallback sur Gmail
  - ❌ Erreurs (avec détails)

---

## 🔧 Troubleshooting

### "RESEND_API_KEY not configured"
✅ Ajouter `RESEND_API_KEY` à `.env.local`

### "Email délivré en Gmail, pas Resend"
- C'est normal! Le fallback fonctionne
- Vérifier le champ `method` dans `emailLogs`

### "Gmail: GMAIL_APP_PASSWORD not configured"
✅ Générer une App Password et l'ajouter à `.env.local`

### "Gmail: Invalid credentials"
- ❌ L'App Password est incorrect
- ✅ Régénérer une nouvelle App Password

### "550 - Relay access denied"
- Gmail bloque les envois en masse après ~500/jour
- ✅ Attendre 24h ou utiliser Resend primaire

---

## 📈 Scaling Future

Quand tu enverras 10k+ emails/jour:
1. **SendGrid** (alternative à Resend)
2. **Mailgun** (meilleur suivi)
3. **Brevo/Sendinblue** (français, RGPD)

Pour l'instant: **Resend + Gmail Fallback** c'est parfait! 🚀
