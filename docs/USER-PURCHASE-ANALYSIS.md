# 📊 Analyse de Tentative d'Achat - Utilisateur Cel70J9yBQMT2fiXVgnAL76LGjq1

## 🔍 Comment analyser cet utilisateur

### Option 1: Via l'API Admin (Recommandé)

```bash
# Remplacer YOUR_ADMIN_API_KEY par votre clé
curl "http://localhost:3000/api/admin/user-analysis?userId=Cel70J9yBQMT2fiXVgnAL76LGjq1&apiKey=YOUR_ADMIN_API_KEY"
```

**Réponse JSON contient:**
- ✅ Informations utilisateur
- ✅ Paniers abandonnés
- ✅ Historique de commandes
- ✅ Tentatives de paiement
- ✅ Recommandations automatiques

### Option 2: Via Firebase Console

1. Aller à **Firestore Database**
2. Collection `users` → Document `Cel70J9yBQMT2fiXVgnAL76LGjq1`
3. Vérifier:
   - Email utilisateur
   - Sous-collection `orders` → statut des commandes
   - Sous-collection `abandoned_carts` → paniers non complétés

---

## 📋 Points à vérifier

### 1️⃣ **Statut du panier**
```
Collection: abandoned_carts
Filtre: userId == "Cel70J9yBQMT2fiXVgnAL76LGjq1"

À chercher:
✓ Valeur du panier
✓ Date d'abandon
✓ Articles dans le panier
✓ Emails de relance envoyés (emailsSent.day3, day7)
```

### 2️⃣ **Tentatives de paiement**
```
Collection: checkout_logs (si vous la loggez)
Filtre: userId == "Cel70J9yBQMT2fiXVgnAL76LGjq1"

À chercher:
✓ Statut: failed, pending, ou completed
✓ Erreur Stripe (si applicable)
✓ Timestamp de la tentative
```

### 3️⃣ **Historique de commandes**
```
Path: users/{userId}/orders
Filtre: userId == "Cel70J9yBQMT2fiXVgnAL76LGjq1"

À chercher:
✓ Nombre total de commandes
✓ Montant total dépensé
✓ Statut de la dernière commande
```

---

## 🎯 Actions recommandées

### Si panier abandonné
- 📧 **Envoyer email de relance** avec code promo (ex: COMEBACK5)
- 💬 **Contacter directement** si valeur > 100€
- 🔍 **Analyser** pourquoi le panier a été abandonné

### Si tentative de paiement échouée
- ✅ **Vérifier erreur Stripe** (card declined, exp date, 3D Secure, etc.)
- 📞 **Contacter client** avec solution (autre moyen de paiement)
- 🔄 **Proposer relancer** le paiement

### Si client régulier
- ⭐ **Offrir programme VIP** / points fidélité
- 🎁 **Proposer réduction** prochaine commande
- 📊 **Analyser** produits favoris

---

## 🛠️ Configuration Firestore requise

Pour utiliser l'API d'analyse complètement, vous devez avoir:

```
Collections:
├── users/
│   └── {userId}/
│       ├── orders/
│       └── [carts] (optionnel)
├── abandoned_carts/
└── checkout_logs/ (optionnel - recommandé pour débuggage)

Documents structure:
abandoned_carts:
  - userId
  - email
  - cartSnapshot
  - cartValue
  - createdAt
  - status: "active" | "recovered" | "lost"
  - emailsSent: { day3, day7 }

checkout_logs:
  - userId
  - status: "failed" | "pending" | "completed"
  - error: string
  - stripeSessionId
  - timestamp
```

---

## 🚀 Endpoint API complet

### GET `/api/admin/user-analysis`
Analyse complète d'un utilisateur

**Paramètres:**
```
?userId=Cel70J9yBQMT2fiXVgnAL76LGjq1
&apiKey=YOUR_ADMIN_API_KEY
```

**Response:**
```json
{
  "userId": "Cel70J9yBQMT2fiXVgnAL76LGjq1",
  "userEmail": "user@example.com",
  "status": "abandoned",
  "abandonedCarts": {
    "count": 1,
    "latestCart": {
      "value": 149.99,
      "items": 3,
      "createdAt": "2026-03-08T15:30:00Z",
      "emailsSent": { "day3": false, "day7": false }
    }
  },
  "orders": {
    "totalOrders": 0,
    "totalSpent": 0,
    "averageOrderValue": 0
  },
  "checkoutAttempts": {
    "failed": 0,
    "pending": 0
  },
  "recommendations": [
    "🔴 Panier abandonné - Envoyer email de relance immédiate",
    "💰 Panier de haute valeur (149.99€) - Priorité haute"
  ]
}
```

### POST `/api/admin/user-analysis`
Déclencher une action sur un utilisateur

**Body:**
```json
{
  "userId": "Cel70J9yBQMT2fiXVgnAL76LGjq1",
  "action": "send_recovery_email",
  "email": "user@example.com"
}
```

---

## 📞 Checklist rapide

- [ ] Vérifier le panier abandonné dans Firestore
- [ ] Vérifier l'email de l'utilisateur
- [ ] Vérifier s'il y a des erreurs de paiement enregistrées
- [ ] Vérifier si c'est un nouveau client ou récurrent
- [ ] Décider de l'action: email, appel, ou analyse technique
- [ ] Mettre à jour le statut du panier dans Firestore
- [ ] Logger l'action prise dans les notes utilisateur

---

*Guide créé pour l'analyse des tentatives d'achat - Utilisateur: Cel70J9yBQMT2fiXVgnAL76LGjq1*
