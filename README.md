# Laxassaye

Boutique e-commerce d'écharpes premium. React + Vite + TypeScript + Tailwind,
Firebase Authentication + Cloud Firestore, Cloudinary pour les images,
déploiement Vercel.

## 1. Installation

```bash
npm install
cp .env.example .env
```

Remplissez `.env` avec vos identifiants Firebase et Cloudinary (voir sections
2 et 3).

```bash
npm run dev
```

## 2. Configuration Firebase

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → activez **Email/Password**.
3. **Firestore Database** → créez une base (mode production).
4. Project settings → General → "Your apps" → ajoutez une app Web → copiez
   les valeurs dans `.env` (`VITE_FIREBASE_*`).
5. Déployez les règles de sécurité et les index fournis :

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # sélectionnez votre projet
firebase deploy --only firestore:rules,firestore:indexes
```

Les règles (`firestore.rules`) sont volontairement strictes : le public ne
peut lire que les produits actifs, les couleurs, les zones de livraison et
les paramètres publics ; il peut créer une commande ou un avis (en attente),
mais ne peut jamais lire, lister ou modifier les commandes, avis en attente,
produits inactifs, ou tout document `admins`. Toute écriture sensible passe
par `isAdmin()`, qui vérifie l'existence d'un document `admins/{uid}`.

### Créer le premier compte admin

1. Firebase console → Authentication → Users → **Add user** (email + mot de
   passe).
2. Copiez son **UID**.
3. Firestore console → collection `admins` → créez un document dont
   **l'ID du document est cet UID** (le contenu peut être vide, ou par
   exemple `{ "email": "vous@exemple.com" }`).
4. Connectez-vous sur `/admin/login` avec cet email et ce mot de passe.

Aucun identifiant admin n'est jamais codé en dur dans le projet.

## 3. Configuration Cloudinary

1. Créez un compte sur [cloudinary.com](https://cloudinary.com).
2. Dashboard → notez votre **Cloud name** → `VITE_CLOUDINARY_CLOUD_NAME`.
3. Settings → Upload → Upload presets → **Add upload preset** :
   - Signing Mode : **Unsigned**
   - Folder : `laxassaye` (optionnel, le code envoie déjà un dossier)
   - Limitez les formats/tailles autorisés selon vos besoins.
4. Copiez le nom du preset → `VITE_CLOUDINARY_UPLOAD_PRESET`.

Le mode "Unsigned" permet l'upload depuis le frontend **sans jamais exposer
l'API Secret**. La suppression d'images Cloudinary nécessite l'API Secret et
doit se faire depuis le dashboard Cloudinary (ou une fonction serverless
signée si vous l'ajoutez plus tard) — voir le commentaire dans
`src/lib/cloudinary.ts`.

## 4. Premières données

Avant de créer des produits, ajoutez au moins :
- Une **couleur** dans `/admin/couleurs`.
- Une **zone de livraison** dans `/admin/livraison`.
- Votre **numéro WhatsApp Business** dans `/admin/parametres`.

Puis créez vos produits dans `/admin/produits`.

## 5. Build & déploiement (Vercel)

```bash
npm run build
```

Sur Vercel : importez le dépôt, ajoutez les mêmes variables `.env` dans
Project Settings → Environment Variables, puis déployez. `vercel.json`
gère déjà le routing SPA (toutes les routes renvoient vers `index.html`).

## 6. Structure

```text
src/
├── components/   composants réutilisables (Header, ProductCard, ColorSwatch…)
├── layouts/      StoreLayout (public) et AdminLayout (dashboard)
├── pages/        pages publiques + pages/admin/ pour le dashboard
├── contexts/      Auth, Cart (localStorage), Language (FR/WO), Theme
├── services/     accès Firestore par collection (products, orders, …)
├── lib/          firebase.ts, cloudinary.ts
├── i18n/         fr.ts, wo.ts
└── types/        modèle de données partagé
```

## 7. Notes importantes

- **Stock & prix jamais approuvés côté client** : `src/services/orders.ts`
  relit chaque produit dans une transaction Firestore, revérifie le stock
  par couleur, recalcule le prix réel (promotions comprises) et décrémente
  le stock de façon atomique — impossible de survendre en cas de forte
  demande simultanée.
- **Numéro de commande** : généré via un document compteur
  (`counters/orders-{année}`) incrémenté dans la même transaction, garanti
  unique, format `LAX-2026-000001`.
- **Panier** : sauvegardé dans `localStorage`, survit à un rafraîchissement.
- **Wolof** : traduction de base fournie (`src/i18n/wo.ts`), à faire
  relire par un locuteur natif avant mise en production.
- **Mode sombre** : préférence sauvegardée localement, respecte
  `prefers-color-scheme` par défaut.
- **Sitemap** : `public/sitemap.xml` liste les pages statiques. Remplacez
  `laxassaye.com` par votre domaine réel avant déploiement ; les pages
  produits n'y sont pas incluses automatiquement (nécessiterait une
  génération côté build).
