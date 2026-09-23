/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Removes `undefined` values and ensures the data can be safely stored in Cloud Firestore.
 * Cloud Firestore rejects documents containing undefined fields.
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore) as unknown as T;
  }
  if (typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        clean[key] = sanitizeForFirestore(value);
      }
    }
    return clean as T;
  }
  return obj;
}

/**
 * Synchronizes a Firestore collection in real-time with local state and localStorage cache.
 * Returns an unsubscribe function to cancel the listener when the component unmounts.
 */
export function syncFirestoreCollection<T extends { id?: string; studentId?: string }>(
  collectionName: string,
  localStorageKey: string,
  onData: (items: T[]) => void,
  fallbackInitialData: T[] = []
): Unsubscribe {
  // 1. Immediately read from localStorage cache for instant zero-latency UI display
  try {
    const cached = localStorage.getItem(localStorageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onData(parsed);
      }
    }
  } catch (err) {
    console.warn(`[FirestoreSync] Failed reading cache for ${collectionName}:`, err);
  }

  // 2. Attach real-time Firestore collection listener
  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: T[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as T;
            // Ensure ID is populated
            if (!data.id && docSnap.id) {
              (data as any).id = docSnap.id;
            }
            items.push(data);
          });

          // Update state and refresh local storage cache
          onData(items);
          try {
            localStorage.setItem(localStorageKey, JSON.stringify(items));
          } catch (e) {
            console.warn(`[FirestoreSync] Failed to update cache for ${collectionName}:`, e);
          }
        } else {
          // Collection is currently empty in Firestore.
          // Check if local storage has valid items to migrate up to Firestore
          try {
            const cached = localStorage.getItem(localStorageKey);
            if (cached) {
              const localItems = JSON.parse(cached);
              if (Array.isArray(localItems) && localItems.length > 0) {
                // Auto-seed Firestore from existing local records
                batchSaveToFirestore(collectionName, localItems);
                onData(localItems);
                return;
              }
            }
          } catch (e) {
            console.warn(`[FirestoreSync] Error checking local cache for migration to ${collectionName}:`, e);
          }

          // If both Firestore and local cache are empty, seed fallback if available
          if (fallbackInitialData.length > 0) {
            batchSaveToFirestore(collectionName, fallbackInitialData);
            onData(fallbackInitialData);
            try {
              localStorage.setItem(localStorageKey, JSON.stringify(fallbackInitialData));
            } catch {}
          } else {
            onData([]);
          }
        }
      },
      (error) => {
        console.warn(`[FirestoreSync] Realtime sync error for ${collectionName} (operating with local cache):`, error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn(`[FirestoreSync] Failed to initiate listener for ${collectionName}:`, err);
    return () => {};
  }
}

/**
 * Saves a single document to Firestore and updates local cache.
 */
export async function saveToFirestore<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<boolean> {
  try {
    const sanitized = sanitizeForFirestore(data);
    await setDoc(doc(db, collectionName, docId), sanitized, { merge: true });
    return true;
  } catch (error) {
    console.warn(`[FirestoreSync] Failed saving document ${docId} to ${collectionName}:`, error);
    return false;
  }
}

/**
 * Deletes a single document from Firestore.
 */
export async function deleteFromFirestore(
  collectionName: string,
  docId: string
): Promise<boolean> {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.warn(`[FirestoreSync] Failed deleting document ${docId} from ${collectionName}:`, error);
    return false;
  }
}

/**
 * Batch saves multiple documents to Firestore.
 */
export async function batchSaveToFirestore<T extends Record<string, any>>(
  collectionName: string,
  items: T[],
  idField: keyof T = 'id'
): Promise<boolean> {
  try {
    for (const item of items) {
      const docId = String(item[idField] || (item as any).studentId || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`);
      const sanitized = sanitizeForFirestore(item);
      await setDoc(doc(db, collectionName, docId), sanitized, { merge: true });
    }
    return true;
  } catch (error) {
    console.warn(`[FirestoreSync] Batch save failed for ${collectionName}:`, error);
    return false;
  }
}

/**
 * Purges all documents in a Firestore collection (e.g. for complete database reset).
 */
export async function clearFirestoreCollection(collectionName: string): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, collectionName));
    const deletePromises = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.warn(`[FirestoreSync] Clear collection failed for ${collectionName}:`, error);
    return false;
  }
}

/**
 * Checks if Cloud Firestore backend is reachable and responsive.
 */
export async function checkFirestoreSyncStatus(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, 'students'));
    return !snap.metadata.fromCache;
  } catch {
    return false;
  }
}
