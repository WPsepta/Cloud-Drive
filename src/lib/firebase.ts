import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  writeBatch,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { StoredFile } from '../types';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const FILES_COLLECTION = 'files';

/**
 * Save / update file metadata in Firestore
 */
export async function syncFileToFirestore(file: StoredFile): Promise<void> {
  try {
    const docRef = doc(db, FILES_COLLECTION, file.id);
    await setDoc(
      docRef,
      {
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        date: file.date,
        timestamp: file.timestamp,
        isPublic: file.isPublic ?? true,
        contentSnippet: file.contentSnippet || '',
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore sync error:', err);
  }
}

/**
 * Delete a file record from Firestore
 */
export async function deleteFileFromFirestore(fileId: string): Promise<void> {
  try {
    const docRef = doc(db, FILES_COLLECTION, fileId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete error:', err);
  }
}

/**
 * Batch delete files from Firestore
 */
export async function batchDeleteFilesFromFirestore(fileIds: string[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    fileIds.forEach((id) => {
      const docRef = doc(db, FILES_COLLECTION, id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (err) {
    console.warn('Firestore batch delete error:', err);
  }
}

/**
 * Clear all files in Firestore collection
 */
export async function clearAllFilesFromFirestore(): Promise<void> {
  try {
    const q = query(collection(db, FILES_COLLECTION));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach((d) => {
      batch.delete(d.ref);
    });
    await batch.commit();
  } catch (err) {
    console.warn('Firestore clear all error:', err);
  }
}

/**
 * Rename a file in Firestore
 */
export async function renameFileInFirestore(fileId: string, newName: string): Promise<void> {
  try {
    const ext = newName.split('.').pop()?.toLowerCase() || '';
    const docRef = doc(db, FILES_COLLECTION, fileId);
    await updateDoc(docRef, {
      name: newName,
      type: ext,
    });
  } catch (err) {
    console.warn('Firestore rename error:', err);
  }
}

/**
 * Subscribe to real-time changes in Firestore files collection
 */
export function subscribeToFiles(onUpdate: (files: StoredFile[]) => void) {
  try {
    const q = query(collection(db, FILES_COLLECTION), orderBy('timestamp', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const firestoreFiles: StoredFile[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          firestoreFiles.push({
            id: data.id || docSnap.id,
            name: data.name || 'Untitled',
            size: data.size || 0,
            type: data.type || 'bin',
            date: data.date || '',
            timestamp: data.timestamp || Date.now(),
            isPublic: data.isPublic ?? true,
            previewUrl: `/api/files/${data.id || docSnap.id}/preview`,
            contentSnippet: data.contentSnippet || '',
          });
        });
        onUpdate(firestoreFiles);
      },
      (err) => {
        console.warn('Firestore subscription error:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore:', err);
    return () => {};
  }
}
