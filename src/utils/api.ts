import { StoredFile, PermissionSettings } from '../types';
import {
  syncFileToFirestore,
  deleteFileFromFirestore,
  batchDeleteFilesFromFirestore,
  clearAllFilesFromFirestore,
  renameFileInFirestore,
} from '../lib/firebase';
import { saveFile } from './storage';
import { formatDate } from './formatters';

export async function fetchFilesAndSettings(): Promise<{
  files: StoredFile[];
  settings?: PermissionSettings;
}> {
  try {
    const res = await fetch('/api/files');
    if (!res.ok) throw new Error('Failed to fetch files');
    const data = await res.json();

    const preparedFiles: StoredFile[] = (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      date: f.date,
      timestamp: f.timestamp,
      isPublic: f.isPublic,
      previewUrl: `/api/files/${f.id}/preview`,
      contentSnippet: f.contentSnippet,
    }));

    // Sync loaded files to Firestore asynchronously
    preparedFiles.forEach((file) => {
      syncFileToFirestore(file).catch(() => {});
    });

    return {
      files: preparedFiles,
      settings: data.settings,
    };
  } catch (err) {
    console.error('Error fetching files from server:', err);
    return { files: [] };
  }
}

// Fallback helper to save files locally and in Firestore
async function fallbackLocalUpload(
  files: File[],
  onProgress: (percent: number, currentName: string) => void
): Promise<{ success: boolean; files: StoredFile[]; message: string }> {
  const newFiles: StoredFile[] = [];
  const now = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const percent = Math.round(((i + 1) / files.length) * 100);
    onProgress(percent, file.name);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const fileId = `file_${now}_${i}_${Math.random().toString(36).substring(2, 6)}`;
    let snippet: string | undefined = undefined;

    if (
      file.type.startsWith('text/') ||
      ['txt', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'py', 'bat', 'ps1', 'sh', 'sql', 'md'].includes(ext)
    ) {
      try {
        const text = await file.text();
        snippet = text.slice(0, 5000);
      } catch (e) {
        console.warn('Could not read snippet:', e);
      }
    }

    const storedFile: StoredFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: ext,
      date: formatDate(new Date()),
      timestamp: now + i,
      isPublic: true,
      blob: file,
      previewUrl: URL.createObjectURL(file),
      contentSnippet: snippet,
    };

    await saveFile(storedFile);
    syncFileToFirestore(storedFile).catch(() => {});
    newFiles.unshift(storedFile);
  }

  return {
    success: true,
    files: newFiles,
    message: `Berhasil menyimpan ${newFiles.length} berkas`,
  };
}

export function uploadFilesWithProgress(
  files: File[],
  onProgress: (percent: number, currentName: string) => void
): Promise<{ success: boolean; files?: StoredFile[]; message?: string }> {
  return new Promise((resolve) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload', true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent, files[0]?.name || 'Berkas');
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          const uploaded: StoredFile[] = (res.files || []).map((f: any) => ({
            id: f.id,
            name: f.name,
            size: f.size,
            type: f.type,
            date: f.date,
            timestamp: f.timestamp,
            isPublic: f.isPublic,
            previewUrl: `/api/files/${f.id}/preview`,
            contentSnippet: f.contentSnippet,
          }));

          // Sync each newly uploaded file to Firestore Cloud
          uploaded.forEach((f) => {
            syncFileToFirestore(f).catch((e) => console.warn('Sync to firestore failed:', e));
          });

          resolve({ success: true, files: uploaded, message: res.message });
        } catch (e) {
          const fallback = await fallbackLocalUpload(files, onProgress);
          resolve(fallback);
        }
      } else {
        // Fallback gracefully so files are never lost
        console.warn('Server upload returned status', xhr.status, '- activating local storage fallback');
        const fallback = await fallbackLocalUpload(files, onProgress);
        resolve(fallback);
      }
    };

    xhr.onerror = async () => {
      console.warn('Server upload connection error - activating local storage fallback');
      const fallback = await fallbackLocalUpload(files, onProgress);
      resolve(fallback);
    };

    xhr.ontimeout = async () => {
      console.warn('Server upload timeout - activating local storage fallback');
      const fallback = await fallbackLocalUpload(files, onProgress);
      resolve(fallback);
    };

    xhr.send(formData);
  });
}

export async function deleteFileFromServer(fileId: string): Promise<boolean> {
  try {
    deleteFileFromFirestore(fileId).catch(() => {});
    const res = await fetch(`/api/files/${fileId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Error deleting file:', err);
    return false;
  }
}

export async function batchDeleteFilesFromServer(fileIds: string[]): Promise<boolean> {
  try {
    batchDeleteFilesFromFirestore(fileIds).catch(() => {});
    const res = await fetch('/api/files/batch-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: fileIds }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error batch deleting files:', err);
    return false;
  }
}

export async function clearAllFilesFromServer(): Promise<boolean> {
  try {
    clearAllFilesFromFirestore().catch(() => {});
    const res = await fetch('/api/files/clear-all', {
      method: 'POST',
    });
    return res.ok;
  } catch (err) {
    console.error('Error clearing all files:', err);
    return false;
  }
}

export async function renameFileOnServer(fileId: string, newName: string): Promise<boolean> {
  try {
    renameFileInFirestore(fileId, newName).catch(() => {});
    const res = await fetch(`/api/files/${fileId}/rename`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newName }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error renaming file:', err);
    return false;
  }
}

export async function updateServerSettings(settings: PermissionSettings): Promise<boolean> {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch (err) {
    console.error('Error updating settings:', err);
    return false;
  }
}
