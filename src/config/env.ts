const requiredFirebaseEnvKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

type RequiredFirebaseEnvKey = (typeof requiredFirebaseEnvKeys)[number];
type OptionalFirebaseEnvKey = "VITE_FIREBASE_MEASUREMENT_ID";

const readEnv = (key: RequiredFirebaseEnvKey | OptionalFirebaseEnvKey) => {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
};

const hasMissingFirebaseConfig = requiredFirebaseEnvKeys.some(
  (key) => readEnv(key).length === 0,
);

export const isFirebaseConfigured = !hasMissingFirebaseConfig;

export const getFirebaseConfig = () => {
  if (!isFirebaseConfigured) {
    const missingKeys = requiredFirebaseEnvKeys.filter(
      (key) => readEnv(key).length === 0,
    );

    throw new Error(
      `Missing Firebase environment variables: ${missingKeys.join(", ")}`,
    );
  }

  return {
    apiKey: readEnv("VITE_FIREBASE_API_KEY"),
    authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("VITE_FIREBASE_APP_ID"),
    measurementId: readEnv("VITE_FIREBASE_MEASUREMENT_ID") || undefined,
  };
};
