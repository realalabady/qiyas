import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";

import { getFirebaseApp } from "@/lib/firebase/app";

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

export const getFirebaseAuth = () => {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }

  return authInstance;
};

export const getFirestoreDb = () => {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp());
  }

  return dbInstance;
};

export const getFirebaseStorage = () => {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp());
  }

  return storageInstance;
};
