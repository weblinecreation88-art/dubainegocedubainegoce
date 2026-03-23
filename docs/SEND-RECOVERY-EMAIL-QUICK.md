# 📧 Envoyer Email de Relance -5% - RAPIDE

## Pour: alain.guyon47@sfr.fr
## Utilisateur: Cel70J9yBQMT2fiXVgnAL76LGjq1
## Code Promo: COMEBACK5 (5% de réduction)

---

## 🚀 Méthode 1: Via cURL (Immédiat)

```bash
curl -X POST http://localhost:3000/api/admin/send-recovery-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alain.guyon47@sfr.fr",
    "userId": "Cel70J9yBQMT2fiXVgnAL76LGjq1",
    "promoCode": "COMEBACK5",
    "discount": 5,
    "apiKey": "YOUR_ADMIN_API_KEY"
  }'
```

## 🚀 Méthode 2: Via Postman/Thunder Client

**URL:** `POST` `http://localhost:3000/api/admin/send-recovery-email`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "alain.guyon47@sfr.fr",
  "userId": "Cel70J9yBQMT2fiXVgnAL76LGjq1",
  "promoCode": "COMEBACK5",
  "discount": 5,
  "apiKey": "YOUR_ADMIN_API_KEY"
}
```

---

## ✅ Réponse attendue

```json
{
  "success": true,
  "message": "Email de relance envoyé à alain.guyon47@sfr.fr",
  "emailId": "email_abc123...",
  "details": {
    "recipient": "alain.guyon47@sfr.fr",
    "promoCode": "COMEBACK5",
    "discount": "5%",
    "cartValue": "149.99€",
    "savedAmount": "7.50€"
  }
}
```

---

## 📧 Contenu de l'email

L'email envoyé contient:
- ✅ Salutation personnalisée (Alain)
- ✅ Rappel du panier abandonné
- ✅ Code promo **COMEBACK5** bien en évidence
- ✅ Économies estimées (ex: 7.50€ sur 149.99€)
- ✅ Lien direct vers le panier avec promo appliquée
- ✅ Assurances: authentique, livraison 48h, retour 14j

---

## 🔗 Vérifier les emails envoyés

```bash
curl "http://localhost:3000/api/admin/send-recovery-email?userId=Cel70J9yBQMT2fiXVgnAL76LGjq1&apiKey=YOUR_ADMIN_API_KEY"
```

Réponse:
```json
{
  "userId": "Cel70J9yBQMT2fiXVgnAL76LGjq1",
  "recoveryEmailsSent": 1,
  "emails": [
    {
      "email": "alain.guyon47@sfr.fr",
      "cartValue": 149.99,
      "sentAt": "2026-03-08T16:45:00.000Z",
      "promoCode": "COMEBACK5"
    }
  ]
}
```

---

## ⚙️ Variables d'environnement requises

```env
# .env.local
ADMIN_API_KEY=your_secure_admin_key
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=contact@dubainegoce.fr
```

---

## 📝 Notes

- ✅ Email personnalisé avec nom du client (si disponible)
- ✅ Montant des économies calculé automatiquement
- ✅ Lien vers panier avec code promo pré-appliqué
- ✅ Statut enregistré dans Firestore (emailsSent.recovery)
- ✅ Email d'essai possible depuis Resend Dashboard

---

## 🎯 Après l'envoi

1. ✅ Email reçu par Alain à `alain.guyon47@sfr.fr`
2. ⏳ En attente: Clic sur le lien ou utilisation du code COMEBACK5
3. 📊 Suivi: Vérifier conversion dans GA4

---

*Action complétée pour: alain.guyon47@sfr.fr | Utilisateur: Cel70J9yBQMT2fiXVgnAL76LGjq1*
