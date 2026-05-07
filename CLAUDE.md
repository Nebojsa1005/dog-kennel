# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server → http://localhost:4200
npm run build      # production build
npm test           # run tests (vitest)
npm run seed       # seed Firebase RTDB (requires scripts/serviceAccountKey.json)
```

Install: always use `--legacy-peer-deps` (Angular 21 vs @angular/fire 20 peer-dep conflict).

## Architecture

Angular 21 **standalone components** app — no NgModules anywhere. All components use `standalone: true` with explicit `imports[]`.

### Data layer

- **Firebase Realtime Database** via `@angular/fire/database` — all reads return `Observable` using `listVal`/`objectVal`
- **No Firebase Storage** — images stored as base64 strings in RTDB, compressed to max 800px/75% JPEG by `ImageService`
- **Auth**: Google sign-in only (`signInWithPopup`). Admin status checked via `/admins/{uid}` node in RTDB
- Services (`core/services/`) are all `providedIn: 'root'` and use `inject()` pattern

### Breeds are static, content is dynamic

Breeds (Bernese Mountain Dog, Maltese, Bolonka Zwetna) are defined statically in `core/config/kennel.config.ts` as `KENNEL_CONFIG`. The RTDB stores per-breed *content* (about text, standards) keyed by breed `id` string (`bernese-mountain-dog`, `maltese`, `bolonka-zwetna`). Breed routes use `/:id` matching these keys.

### Routing structure

```
/                         → Home
/breeds/:id               → Breed shell (about / standards / males / females child routes)
/puppies[/:breed]         → Puppies (optional breed filter)
/archive[/:breed]         → Archive (optional breed filter)
/contact                  → Contact
/login                    → Google sign-in
/admin/**                 → Admin panel (authGuard + adminGuard required)
```

All routes lazy-load via `loadComponent`. `withComponentInputBinding()` is enabled — route params bind directly as `@Input()`.

### Admin panel

`/admin` is guarded by `authGuard` (must be signed in) then `adminGuard` (UID must exist in `/admins` RTDB node). Sub-routes: dashboard, dogs, litters, puppies, breeds, users. Each has a list component + dialog component for CRUD.

### i18n

`@ngx-translate` with HTTP loader — translation files at `public/i18n/{lang}.json`. Default language: `en`. Use `TranslateModule` and `| translate` pipe in templates.

### Formatting

Prettier enforced — `printWidth: 100`, `singleQuote: true`, Angular HTML parser for `.html` files.

## Key files

| File | Purpose |
|------|---------|
| `src/app/core/config/kennel.config.ts` | Static breed list + kennel contact info |
| `src/environments/environment.ts` | Firebase config (fill in for new setup — see SETUP.md) |
| `firebase/database.rules.json` | RTDB security rules |
| `scripts/seed-firebase.ts` | One-time DB seed; needs `scripts/serviceAccountKey.json` (not committed) |
