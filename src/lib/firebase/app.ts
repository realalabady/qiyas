import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

import { getFirebaseConfig } from "@/config/env";

let firebaseAppInstance: FirebaseApp | null = null;

export const getFirebaseApp = () => {
  if (firebaseAppInstance) {
    return firebaseAppInstance;
  }

  firebaseAppInstance = getApps().length
    ? getApp()
    : initializeApp(getFirebaseConfig());

  return firebaseAppInstance;
};
