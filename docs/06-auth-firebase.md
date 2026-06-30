# 06 — Auth & Firebase

Firebase is used **only for admin authentication**. App content does not live in Firestore (see 01/02).

## Lazy singletons

- `src/lib/firebase/app.ts` — `getFirebaseApp()` initializes once via `getFirebaseConfig()` (reuses existing app if present).
- `src/lib/firebase/services.ts` — `getFirebaseAuth()`, `getFirestoreDb()`, `getFirebaseStorage()`; each memoized.
- `src/config/env.ts` — reads/validates `VITE_FIREBASE_*`; `getFirebaseConfig()` throws if any of the 6 required keys missing.

## Auth context — `src/contexts/admin-context.tsx`

`AdminProvider` (wraps the whole app in `App.tsx`):

- On mount, subscribes to `onAuthStateChanged`. On a signed-in user, calls `isAdminUid(uid)` and stores `{user, isAdmin, isLoading}`.
- `login(email, password)` → `signInWithEmailAndPassword`, then `isAdminUid`; **if not admin, immediately `signOut` and throws** "Not an admin user".
- `logout()` → `signOut`.
- `useAdmin()` hook throws if used outside the provider.

## Admin check — `src/lib/firebase/admins.ts`

- `getAdminProfileByUid(uid)` → reads Firestore doc `admins/{uid}`. Returns `null` if missing; throws if `role` isn't `"admin"|"super_admin"`.
- `isAdminUid(uid)` → `Boolean(profile?.isActive)`.
- `AdminProfile { role, email, isActive }`.

## Firestore rules — `firestore.rules`

Describes an **intended** backend (quizzes/articles/categories/analytics/settings/media collections gated by an `isAdmin()` helper that checks `admins/{uid}.isActive`). The only collection actually used at runtime is `admins`. The `quizzes`/`articles`/etc. rules are aspirational given the localStorage architecture.

## Admin setup

- `ADMIN_SETUP.md`, `setup-admin.mjs`, `setup-admin.bat`, `setup-admin-firestore.js`, `public/setup-admin.html` — scripts/docs to create an admin user and the `admins/{uid}` doc.
- Firebase project: `qiyas-5da06`.

## ⚠️ Security notes (also in ANALYSIS)

- **`auth_data.json` is committed to the repo** and contains a Firebase Auth emulator export with a user record including `passwordHash` + `salt` for a local admin account. This is emulator data, but credentials/hashes should not be in version control. `.gitignore` does not exclude it.
- `VITE_FIREBASE_*` keys are public by nature (client SDK), so exposure of the config is expected — security must come from Firestore rules, not key secrecy.
- The admin gate is **client-side only** for the localStorage data: anyone can open the app and edit localStorage-backed content in their own browser. The `ProtectedAdminRoute` only restricts the UI, and the "data" is per-browser. This is fine for a demo but means "admin" content is not centrally authoritative.
