import { initializeApp, cert, getApps, type ServiceAccount } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

function readFirebaseDatabaseUrl() {
  return (typeof process !== 'undefined' && process.env?.FIREBASE_DATABASE_URL) || import.meta.env.FIREBASE_DATABASE_URL || '';
}

function readFirebaseServiceAccountJson() {
  return (typeof process !== 'undefined' && process.env?.FIREBASE_SERVICE_ACCOUNT_JSON) || import.meta.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
}

function parseServiceAccount(): ServiceAccount | null {
  const raw = readFirebaseServiceAccountJson();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    return {
      ...parsed,
      privateKey: parsed.privateKey?.replace(/\\n/g, '\n'),
    };
  } catch (error) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON:', error);
    return null;
  }
}

export function isFirebaseAdminConfigured() {
  return Boolean(readFirebaseDatabaseUrl() && parseServiceAccount());
}

export function getFirebaseDb() {
  const databaseURL = readFirebaseDatabaseUrl();
  const serviceAccount = parseServiceAccount();

  if (!databaseURL || !serviceAccount) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_DATABASE_URL and FIREBASE_SERVICE_ACCOUNT_JSON.',
    );
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL,
    });
  }

  return getDatabase();
}

export async function getPath<T>(path: string): Promise<T | null> {
  const db = getFirebaseDb();
  const snap = await db.ref(path).get();
  return snap.exists() ? (snap.val() as T) : null;
}

export async function setPath<T>(path: string, value: T): Promise<void> {
  const db = getFirebaseDb();
  await db.ref(path).set(value);
}