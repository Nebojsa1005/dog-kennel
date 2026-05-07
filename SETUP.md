# Firebase Setup Guide

## Prerequisites
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`

---

## Step 1 — Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**, name it (e.g. `dog-kennel`)
3. Disable Google Analytics if not needed → **Create project**

---

## Step 2 — Enable Firebase Services

### Realtime Database
1. Left menu → **Build → Realtime Database** → **Create database**
2. Choose region closest to you
3. Start in **test mode** (you'll apply rules in step 4)

### Authentication — Google Provider
1. Left menu → **Build → Authentication** → **Get started**
2. **Sign-in method** tab → **Google** → Enable → Save

> **Note:** Firebase Storage is not used. Photos are stored as compressed base64 strings
> directly in the Realtime Database. Keep source images under 1 MB before uploading.
> The app compresses to max 800 px wide at 75% JPEG quality automatically.

---

## Step 3 — Copy Firebase Config

1. Left menu → **Project settings** (gear icon)
2. Scroll to **Your apps** → click **</>** (Web) → Register app
3. Copy the `firebaseConfig` object
4. Paste into `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'your-actual-key',
    authDomain: 'your-project.firebaseapp.com',
    databaseURL: 'https://your-project-default-rtdb.firebaseio.com',  // required!
    projectId: 'your-project',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
  },
};
```

> **Important:** `databaseURL` is required for Realtime Database. Find it in
> Firebase Console → Realtime Database → the URL shown at the top (e.g.
> `https://your-project-default-rtdb.firebaseio.com`).

Also copy the same config into `src/environments/environment.prod.ts`.

---

## Step 4 — Apply Database Security Rules

1. Firebase Console → **Realtime Database** → **Rules** tab
2. Replace with the contents of `firebase/database.rules.json`
3. Click **Publish**

---

## Step 5 — Seed the Database

### Install seed dependencies
```bash
npm install --legacy-peer-deps
```

### Find your UID
1. Start the app: `ng serve`
2. Go to `/login` in your browser and sign in with Google
3. Firebase Console → **Authentication** → **Users** tab
4. Copy your **UID** from the table

### Configure the seed script
Edit `scripts/seed-firebase.ts` — update these lines:

```typescript
const DATABASE_URL = 'https://your-project-default-rtdb.firebaseio.com';
const ADMIN_UID    = 'your-firebase-uid-here';
const ADMIN_EMAIL  = 'your@email.com';
const ADMIN_NAME   = 'Your Name';
```

### Download service account key
1. Firebase Console → **Project settings** → **Service accounts** tab
2. Click **Generate new private key** → download JSON
3. Save as `scripts/serviceAccountKey.json`
   - **DO NOT commit this file** — add it to `.gitignore`

### Run the seed
```bash
npm run seed
```

---

## Step 6 — Start the App

```bash
ng serve
```

- Public site: `http://localhost:4200`
- Admin panel: `http://localhost:4200/admin` (redirects to login)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Permission denied` in DB | Check security rules are published |
| Sign-in popup blocked | Allow popups for localhost in browser |
| Admin panel redirects to `/` | Your UID is not in `/admins` — re-run seed or add manually |
| DB reads/writes fail silently | Ensure `databaseURL` is in your Firebase config |
| `@angular/fire` peer dep warning | Expected — Angular 21 vs AngularFire 20; use `--legacy-peer-deps` |

---

## Project Structure

```
src/
├── environments/
│   ├── environment.ts          ← dev config (fill in your Firebase config)
│   └── environment.prod.ts     ← prod config
└── app/
    ├── core/
    │   ├── models/             ← breed, dog, litter, puppy, admin interfaces
    │   ├── services/           ← breed, dog, litter, puppy, auth, admin, image
    │   └── guards/             ← auth.guard, admin.guard
    └── features/
        ├── login/              ← /login page
        └── admin/              ← /admin/* pages (layout + dashboard + CRUD)
firebase/
└── database.rules.json
scripts/
├── seed-firebase.ts
└── serviceAccountKey.json      ← YOU create this (not committed)
```
