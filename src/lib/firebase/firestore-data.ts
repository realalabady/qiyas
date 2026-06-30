/**
 * Generic Firestore data access for content collections
 * (quizzes, articles, categories).
 *
 * Documents are stored with the entity's own `id` as the Firestore doc id.
 * Values are JSON round-tripped before writing so that `undefined` is stripped
 * and `Date` fields become ISO strings — which the stores' `normalize*`
 * helpers parse back into `Date` on read.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/services";

/** Strip `undefined` and convert `Date` -> ISO string so the value is Firestore-safe. */
const toPlain = (value: unknown): Record<string, unknown> =>
  JSON.parse(JSON.stringify(value));

/** Read every document in a collection. Requires admin auth for gated collections. */
export async function fetchAllDocs<T>(collectionName: string): Promise<T[]> {
  const snapshot = await getDocs(collection(getFirestoreDb(), collectionName));
  return snapshot.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
}

/** Read only published documents — safe for anonymous/public visitors. */
export async function fetchPublishedDocs<T>(
  collectionName: string,
): Promise<T[]> {
  const publishedQuery = query(
    collection(getFirestoreDb(), collectionName),
    where("published", "==", true),
  );
  const snapshot = await getDocs(publishedQuery);
  return snapshot.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
}

/** Create or overwrite a document by id. */
export async function saveDocById(
  collectionName: string,
  id: string,
  data: unknown,
): Promise<void> {
  await setDoc(doc(getFirestoreDb(), collectionName, id), toPlain(data));
}

/** Delete a document by id. */
export async function deleteDocById(
  collectionName: string,
  id: string,
): Promise<void> {
  await deleteDoc(doc(getFirestoreDb(), collectionName, id));
}
