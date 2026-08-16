import React, { useState, useEffect, useRef } from 'react';
import { StoredFile, ViewMode, PermissionSettings, ToastMessage } from './types';
import {
  getAllFiles,
  saveFile,
  saveMultipleFiles,
  deleteFileFromStorage,
  deleteMultipleFilesFromStorage,
  updateFileNameInStorage,
} from './utils/storage';
import { formatDate } from './utils/formatters';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { FileManagerView } from './components/FileManagerView';
import { FilePreviewModal } from './components/FilePreviewModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { RenameModal } from './components/RenameModal';
import { PermissionsModal } from './components/PermissionsModal';
import { Toast } from './components/Toast';

export default function App() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  
  // Modals state
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<StoredFile | null>(null);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<StoredFile | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  // Permission settings
  const [permissions, setPermissions] = useState<PermissionSettings>({
    isPublic: true,
    passwordProtected: false,
    allowDownload: true,
  });

  // Upload Progress
  const [uploadProgress, setUploadProgress] = useState<{
    isUploading: boolean;
    progress: number;
    currentFileName: string;
  }>({
    isUploading: false,
    progress: 0,
    currentFileName: '',
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files on mount
  useEffect(() => {
    async function load() {
      const stored = await getAllFiles();
      setFiles(stored);
    }
    load();
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger hidden file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // File Upload Processor
  const handleFilesSelected = async (fileList: FileList | File[] | null) => {
    if (!fileList || fileList.length === 0) return;
    const fileArray = Array.from(fileList);
    if (fileArray.length === 0) return;

    // Switch to manager view to show upload progress
    setCurrentView('manager');

    setUploadProgress({
      isUploading: true,
      progress: 15,
      currentFileName: fileArray[0].name,
    });

    // Simulate animated upload stages
    const progressTimer1 = setTimeout(() => {
      setUploadProgress((prev) => ({ ...prev, progress: 55 }));
    }, 150);

    const progressTimer2 = setTimeout(() => {
      setUploadProgress((prev) => ({ ...prev, progress: 85 }));
    }, 300);

    // Read and convert files
    const newStoredFiles: StoredFile[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const f = fileArray[i];
      const ext = f.name.split('.').pop()?.toLowerCase() || 'txt';
      const now = new Date();
      const id = 'file_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 6);

      let snippet: string | undefined = undefined;
      // Read text snippet for text/code files
      if (
        f.type.startsWith('text/') ||
        ['txt', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'py', 'bat', 'ps1', 'sh', 'sql', 'md'].includes(ext)
      ) {
        try {
          const text = await f.slice(0, 5000).text();
          snippet = text;
        } catch (e) {
          console.warn('Could not read text slice:', e);
        }
      }

      const previewUrl = URL.createObjectURL(f);

      const newStored: StoredFile = {
        id,
        name: f.name,
        size: f.size,
        type: ext,
        date: formatDate(now),
        timestamp: Date.now() + i,
        isPublic: permissions.isPublic,
        blob: f,
        previewUrl,
        contentSnippet: snippet,
      };

      newStoredFiles.push(newStored);
    }

    clearTimeout(progressTimer1);
    clearTimeout(progressTimer2);

    // Save to IndexedDB
    await saveMultipleFiles(newStoredFiles);

    // Update state
    setFiles((prev) => [...newStoredFiles, ...prev]);

    setUploadProgress({
      isUploading: true,
      progress: 100,
      currentFileName: 'Selesai!',
    });

    setTimeout(() => {
      setUploadProgress({
        isUploading: false,
        progress: 0,
        currentFileName: '',
      });
    }, 450);

    addToast(`Berhasil mengunggah ${fileArray.length} berkas ke drive cloud!`, 'success');
  };

  // Download Handler
  const handleDownload = (file: StoredFile) => {
    let url = file.previewUrl;
    let createdUrl = false;

    if (!url && file.blob) {
      url = URL.createObjectURL(file.blob);
      createdUrl = true;
    } else if (!url && file.contentSnippet) {
      const blob = new Blob([file.contentSnippet], { type: 'text/plain;charset=utf-8' });
      url = URL.createObjectURL(blob);
      createdUrl = true;
    }

    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (createdUrl) {
        setTimeout(() => URL.revokeObjectURL(url!), 1000);
      }
      addToast(`Mengunduh berkas: ${file.name}`, 'info');
    } else {
      addToast(`Tidak dapat mengunduh berkas ${file.name}`, 'error');
    }
  };

  // Single File Delete
  const handleConfirmSingleDelete = async () => {
    if (!fileToDelete) return;
    const targetId = fileToDelete.id;
    const targetName = fileToDelete.name;

    // Delete from storage
    await deleteFileFromStorage(targetId);

    // Update state immediately
    setFiles((prev) => prev.filter((f) => f.id !== targetId));
    setSelectedFileIds((prev) => prev.filter((id) => id !== targetId));

    if (previewFile?.id === targetId) {
      setPreviewFile(null);
    }

    setFileToDelete(null);
    addToast(`Berkas "${targetName}" berhasil dihapus`, 'success');
  };

  // Batch Delete
  const handleConfirmBatchDelete = async () => {
    if (selectedFileIds.length === 0) return;

    const count = selectedFileIds.length;
    await deleteMultipleFilesFromStorage(selectedFileIds);

    setFiles((prev) => prev.filter((f) => !selectedFileIds.includes(f.id)));
    setSelectedFileIds([]);
    setIsBatchDeleteModalOpen(false);

    addToast(`Berhasil menghapus ${count} berkas`, 'success');
  };

  // Clear All Files
  const handleConfirmClearAll = async () => {
    const allIds = files.map((f) => f.id);
    await deleteMultipleFilesFromStorage(allIds);

    setFiles([]);
    setSelectedFileIds([]);
    setIsClearAllModalOpen(false);

    addToast('Semua berkas di drive cloud telah dibersihkan', 'success');
  };

  // Rename File
  const handleRename = async (fileId: string, newName: string) => {
    await updateFileNameInStorage(fileId, newName);

    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          const ext = newName.split('.').pop()?.toLowerCase() || f.type;
          return { ...f, name: newName, type: ext };
        }
        return f;
      })
    );

    if (previewFile?.id === fileId) {
      const ext = newName.split('.').pop()?.toLowerCase() || previewFile.type;
      setPreviewFile({ ...previewFile, name: newName, type: ext });
    }

    addToast(`Nama berkas diubah menjadi "${newName}"`, 'success');
  };

  // Selection handlers
  const handleToggleSelect = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    setSelectedFileIds(files.map((f) => f.id));
  };

  const handleDeselectAll = () => {
    setSelectedFileIds([]);
  };

  // Share drive link
  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Tautan drive cloud berhasil disalin ke papan klip!', 'success');
    } else {
      addToast('Tautan siap dibagikan: ' + window.location.href, 'info');
    }
  };

  const totalSize = files.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-200 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Hidden File Input for Global Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onTriggerUpload={triggerFileInput}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
        fileCount={files.length}
      />

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
        totalFiles={files.length}
        totalSize={totalSize}
        onClearAllPrompt={() => setIsClearAllModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' ? (
          <HomeView
            files={files}
            onTriggerUpload={triggerFileInput}
            onOpenManager={() => setCurrentView('manager')}
            onDropFiles={handleFilesSelected}
          />
        ) : (
          <FileManagerView
            files={files}
            selectedFileIds={selectedFileIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onPreviewFile={(f) => setPreviewFile(f)}
            onDownloadFile={handleDownload}
            onRenameFile={(f) => setFileToRename(f)}
            onDeleteFile={(f) => setFileToDelete(f)}
            onBatchDeletePrompt={() => setIsBatchDeleteModalOpen(true)}
            onOpenPermissions={() => setIsPermissionsModalOpen(true)}
            onShareLink={handleShareLink}
            onTriggerUpload={triggerFileInput}
            onDropFiles={handleFilesSelected}
            uploadProgress={uploadProgress}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1e2c54] py-6 px-4 bg-[#0b1329] text-xs text-slate-400 text-center space-y-3">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium">
          <button
            onClick={() => setCurrentView('home')}
            className={`transition ${currentView === 'home' ? 'text-blue-400' : 'hover:text-white'}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('manager')}
            className={`transition ${currentView === 'manager' ? 'text-blue-400' : 'hover:text-white'}`}
          >
            File Manager
          </button>
          <button
            onClick={() => setIsPermissionsModalOpen(true)}
            className="hover:text-white transition"
          >
            Access & Permissions
          </button>
          <a href="mailto:rikasma009@gmail.com" className="hover:text-white transition">
            Contact: rikasma009@gmail.com
          </a>
        </div>
        <div className="text-slate-400">
          FileKu © 2026 • Created by{' '}
          <a
            href="https://tiktok.com/@wp_septa"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline font-medium"
          >
            WP septa
          </a>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
      />

      {/* Single Delete Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(fileToDelete)}
        fileToDelete={fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleConfirmSingleDelete}
      />

      {/* Batch Delete Modal */}
      <DeleteConfirmModal
        isOpen={isBatchDeleteModalOpen}
        fileToDelete={null}
        isBatch={true}
        selectedCount={selectedFileIds.length}
        onClose={() => setIsBatchDeleteModalOpen(false)}
        onConfirm={handleConfirmBatchDelete}
      />

      {/* Clear All Modal */}
      <DeleteConfirmModal
        isOpen={isClearAllModalOpen}
        fileToDelete={null}
        isClearAll={true}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={handleConfirmClearAll}
      />

      {/* Rename Modal */}
      <RenameModal
        file={fileToRename}
        isOpen={Boolean(fileToRename)}
        onClose={() => setFileToRename(null)}
        onRename={handleRename}
      />

      {/* Access Permissions Modal */}
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        settings={permissions}
        onSave={(newSettings) => {
          setPermissions(newSettings);
          addToast('Pengaturan izin drive berhasil disimpan!', 'success');
        }}
        onShareLink={handleShareLink}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
