import { UploadedFileRecord } from '../types';

const DB_NAME = 'ShubhamPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'assignment_files';
const STUDENT_ID = 'shubham';
const PUBLIC_BLOB_BASE = 'https://ibqbg2fc8f0ls8ra.public.blob.vercel-storage.com';

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  // If running locally on localhost without vercel dev, route API calls to the live backend
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'https://ewemproject-shubham.vercel.app';
  }
  return '';
}

/**
 * Initialize and open IndexedDB instance (local offline cache)
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'assignmentId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve all saved records across devices from Cloud Storage (Vercel Blob),
 * with graceful fallback and sync to local IndexedDB.
 */
export async function getAllFileRecords(): Promise<Record<string, UploadedFileRecord>> {
  let cloudRecords: Record<string, UploadedFileRecord> | null = null;

  // 1. Fetch from cloud storage
  try {
    const apiBase = getApiBaseUrl();
    const endpoint = `${apiBase}/api/assignments?student=${STUDENT_ID}&t=${Date.now()}`;
    const res = await fetch(endpoint, { cache: 'no-store' });

    if (res.ok) {
      const data = await res.json();
      if (data && data.records) {
        cloudRecords = data.records;
      }
    } else {
      // Fallback: direct CDN JSON fetch
      const directUrl = `${PUBLIC_BLOB_BASE}/${STUDENT_ID}/assignments.json?t=${Date.now()}`;
      const directRes = await fetch(directUrl, { cache: 'no-store' });
      if (directRes.ok) {
        cloudRecords = await directRes.json();
      }
    }
  } catch (cloudErr) {
    console.warn('Could not fetch cloud assignment records, falling back to local cache:', cloudErr);
  }

  // 2. If cloud records were retrieved, update local IndexedDB cache and return
  if (cloudRecords) {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const record of Object.values(cloudRecords)) {
        store.put(record);
      }
    } catch (cacheErr) {
      console.warn('Failed to cache cloud records in IndexedDB:', cacheErr);
    }
    return cloudRecords;
  }

  // 3. Fallback: Read local IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const records: Record<string, UploadedFileRecord> = {};
        for (const item of req.result || []) {
          records[item.assignmentId] = item;
        }
        resolve(records);
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

/**
 * Save an uploaded file record to Cloud Storage & local IndexedDB
 */
export async function saveFileRecord(
  assignmentId: string,
  file: File
): Promise<UploadedFileRecord> {
  const apiBase = getApiBaseUrl();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('assignmentId', assignmentId);
  formData.append('student', STUDENT_ID);

  let record: UploadedFileRecord;

  try {
    const res = await fetch(`${apiBase}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    record = {
      ...data.record,
      blob: file, // Keep local file instance for instant local preview if needed
    };
  } catch (err) {
    console.error('Cloud upload error, falling back to local record:', err);
    // Fallback local record if network fails
    record = {
      assignmentId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || getFallbackMimeType(file.name),
      uploadedAt: new Date().toISOString(),
      blob: file,
    };
  }

  // Cache in IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(record);
  } catch (dbErr) {
    console.warn('Failed to write record to IndexedDB:', dbErr);
  }

  return record;
}

/**
 * Delete a file record from Cloud Storage & local IndexedDB
 */
export async function deleteFileRecord(assignmentId: string): Promise<void> {
  const apiBase = getApiBaseUrl();

  try {
    await fetch(`${apiBase}/api/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId, student: STUDENT_ID }),
    });
  } catch (cloudErr) {
    console.warn('Cloud delete error:', cloudErr);
  }

  // Delete from local IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(assignmentId);
  } catch (dbErr) {
    console.warn('IndexedDB delete error:', dbErr);
  }
}

/**
 * Allowed file extensions based on portfolio requirements
 */
export const ALLOWED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'zip',
  'png',
  'jpg',
  'jpeg',
];

export function validateFileType(file: File): { valid: boolean; error?: string } {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported format ".${extension || 'unknown'}". Allowed formats: ${ALLOWED_EXTENSIONS.map(
        (ext) => '.' + ext.toUpperCase()
      ).join(', ')}.`,
    };
  }

  // 30MB limit check
  const MAX_SIZE_BYTES = 30 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 30MB limit (${formatBytes(file.size)}). Please compress your file.`,
    };
  }

  return { valid: true };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

function getFallbackMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'doc': return 'application/msword';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls': return 'application/vnd.ms-excel';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'ppt': return 'application/vnd.ms-powerpoint';
    case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'zip': return 'application/zip';
    default: return 'application/octet-stream';
  }
}
