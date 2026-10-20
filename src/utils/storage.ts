import { UploadedFileRecord } from '../types';

const DB_NAME = 'ShubhamPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'assignment_files';

/**
 * Initialize and open IndexedDB instance
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
 * Save an uploaded file record into IndexedDB
 */
export async function saveFileRecord(
  assignmentId: string,
  file: File
): Promise<UploadedFileRecord> {
  const db = await openDB();

  // Read preview/data URL for fast rendering if small enough, or store raw blob
  const record: UploadedFileRecord = {
    assignmentId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || getFallbackMimeType(file.name),
    uploadedAt: new Date().toISOString(),
    blob: file,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const putRequest = store.put(record);

    putRequest.onsuccess = () => resolve(record);
    putRequest.onerror = () => reject(putRequest.error);
  });
}

/**
 * Retrieve a specific uploaded file record by assignmentId
 */
export async function getFileRecord(
  assignmentId: string
): Promise<UploadedFileRecord | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(assignmentId);

      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (error) {
    console.error(`Failed to get file for ${assignmentId}:`, error);
    return null;
  }
}

/**
 * Retrieve all saved records as a dictionary mapped by assignmentId
 */
export async function getAllFileRecords(): Promise<Record<string, UploadedFileRecord>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records: Record<string, UploadedFileRecord> = {};
        const list: UploadedFileRecord[] = request.result || [];
        for (const item of list) {
          records[item.assignmentId] = item;
        }
        resolve(records);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load file records from IndexedDB:', error);
    return {};
  }
}

/**
 * Delete a file record from IndexedDB
 */
export async function deleteFileRecord(assignmentId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const deleteRequest = store.delete(assignmentId);

    deleteRequest.onsuccess = () => resolve();
    deleteRequest.onerror = () => reject(deleteRequest.error);
  });
}

/**
 * Allowed file extensions based on portfolio requirements
 * PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP, PNG, and JPG files
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
      error: `Unsupported file format ".${extension || 'unknown'}". Allowed formats: ${ALLOWED_EXTENSIONS.map(
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
  if (bytes === 0) return '0 B';
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
    case 'pdf':
      return 'application/pdf';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'zip':
      return 'application/zip';
    default:
      return 'application/octet-stream';
  }
}
