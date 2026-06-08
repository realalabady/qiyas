# Qiyas Admin Setup Guide

## Admin Login Credentials

### Adding Admin Users

Admin access is managed through Firebase Firestore. To add an admin user:

1. **Create Firebase User**
   - Go to Firebase Console > Authentication > Add User
   - Email: `admin@qiyas.local` (or your preferred email)
   - Password: Set a strong password

2. **Add Admin Record to Firestore**
   - Database: Firestore in qiyas-5da06 project
   - Collection: `admins`
   - Document ID: (use the Firebase UID from step 1)
   - Fields:
     ```json
     {
       "email": "admin@qiyas.local",
       "role": "super_admin",
       "isActive": true,
       "createdAt": "2026-06-08T00:00:00Z"
     }
     ```

### Default Demo Admin (For Testing)

If you've already created a Firebase user, use those credentials:

- **Email**: Your Firebase authentication email
- **Password**: Your Firebase password

### Verifying Admin Access

1. Navigate to `/admin/login`
2. Enter your credentials
3. If login succeeds, you'll be redirected to `/admin` dashboard
4. If you get "Not an admin user" error, check that your UID document exists in the `admins` collection

---

## Firestore Collections Structure

```
project: qiyas-5da06

admins/
  {uid}/
    - email: string
    - role: "admin" | "super_admin"
    - isActive: boolean

quizzes/
  {slug}/
    - title: string
    - description: string
    - category: string
    - questions: array
    - results: array
    - published: boolean

articles/
  {id}/
    - title: string
    - slug: string
    - content: string
    - image: string (Firebase Storage URL)
    - createdAt: timestamp
    - updatedAt: timestamp
    - published: boolean

settings/
  theme/
    - primaryColor: string
    - accentColor: string
    - logo: string (Firebase Storage URL)
    - updated: timestamp
```

---

## Firebase CLI Commands

```bash
# Login to Firebase
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules

# View Firestore data
firebase firestore:inspect admins

# Download Firestore data
firebase firestore:backup gs://qiyas-5da06.appspot.com/backups
```

---

## Environment Variables

Your `.env.local` already contains:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=qiyas-5da06.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=qiyas-5da06
VITE_FIREBASE_STORAGE_BUCKET=qiyas-5da06.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1080911495333
VITE_FIREBASE_APP_ID=1:1080911495333:web:39908d926ce064a0308d4c
```

No changes needed unless you're switching Firebase projects.
