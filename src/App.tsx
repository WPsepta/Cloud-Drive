import React, { useState, useEffect, useRef } from 'react';
import { Instagram, MessageCircle, Music2 } from 'lucide-react';
import { StoredFile, ViewMode, ToastMessage } from './types';
import {
  fetchFilesAndSettings,
  uploadFilesWithProgress,
  deleteFileFromServer,
  batchDeleteFilesFromServer,
  clearAllFilesFromServer,
  renameFileOnServer,
} from './utils/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { FileManagerView } from './components/FileManagerView';
import { FilePreviewModal } from './components/FilePreviewModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { RenameModal } from './components/RenameModal';
import { Toast } from './components/Toast';

export default function App() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [, setIsLoading] = useState(true);
  
  // Modals state
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<StoredFile | null>(null);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<StoredFile | null>(null);

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

  // Load files from server on mount
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await fetchFilesAndSettings();
      setFiles(res.files);
      setIsLoading(false);
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

  // File Upload Processor - uploads directly to Cloud Server
  const handleFilesSelected = async (fileList: FileList | File[] | null) => {
    if (!fileList || fileList.length === 0) return;
    const fileArray = Array.from(fileList);
    if (fileArray.length === 0) return;

    // Switch to manager view to show upload progress
    setCurrentView('manager');

    setUploadProgress({
      isUploading: true,
      progress: 10,
      currentFileName: fileArray[0].name,
    });

    try {
      const result = await uploadFilesWithProgress(fileArray, (progress, currentName) => {
        setUploadProgress({
          isUploading: true,
          progress: Math.min(95, progress),
          currentFileName: currentName,
        });
      });

      if (result.success && result.files) {
        setFiles((prev) => [...result.files!, ...prev]);
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
        }, 400);

        addToast(`Berhasil mengunggah ${fileArray.length} berkas ke drive cloud!`, 'success');
      } else {
        throw new Error(result.message || 'Gagal mengunggah berkas');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadProgress({
        isUploading: false,
        progress: 0,
        currentFileName: '',
      });
      addToast(`Gagal mengunggah: ${err.message || 'Koneksi bermasalah'}`, 'error');
    }
  };

  // Download Handler - downloads from server binary endpoint
  const handleDownload = (file: StoredFile) => {
    const downloadUrl = `/api/files/${file.id}/download`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Mengunduh berkas: ${file.name}`, 'info');
  };

  // Download all selected files
  const handleDownloadSelected = async () => {
    if (selectedFileIds.length === 0) return;
    const selectedFiles = files.filter((f) => selectedFileIds.includes(f.id));
    addToast(`Memulai unduhan untuk ${selectedFiles.length} berkas...`, 'info');

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const downloadUrl = `/api/files/${file.id}/download`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (i < selectedFiles.length - 1) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  };

  // Single File Delete - deletes from Cloud Server
  const handleConfirmSingleDelete = async () => {
    if (!fileToDelete) return;
    const targetId = fileToDelete.id;
    const targetName = fileToDelete.name;

    const ok = await deleteFileFromServer(targetId);
    if (ok) {
      setFiles((prev) => prev.filter((f) => f.id !== targetId));
      setSelectedFileIds((prev) => prev.filter((id) => id !== targetId));

      if (previewFile?.id === targetId) {
        setPreviewFile(null);
      }

      setFileToDelete(null);
      addToast(`Berkas "${targetName}" berhasil dihapus dari cloud drive`, 'success');
    } else {
      addToast(`Gagal menghapus berkas "${targetName}"`, 'error');
    }
  };

  // Batch Delete
  const handleConfirmBatchDelete = async () => {
    if (selectedFileIds.length === 0) return;

    const count = selectedFileIds.length;
    const ok = await batchDeleteFilesFromServer(selectedFileIds);

    if (ok) {
      setFiles((prev) => prev.filter((f) => !selectedFileIds.includes(f.id)));
      setSelectedFileIds([]);
      setIsBatchDeleteModalOpen(false);

      addToast(`Berhasil menghapus ${count} berkas`, 'success');
    } else {
      addToast('Gagal menghapus berkas terpilih', 'error');
    }
  };

  // Clear All Files
  const handleConfirmClearAll = async () => {
    const ok = await clearAllFilesFromServer();
    if (ok) {
      setFiles([]);
      setSelectedFileIds([]);
      setIsClearAllModalOpen(false);

      addToast('Semua berkas di drive cloud telah dibersihkan', 'success');
    } else {
      addToast('Gagal membersihkan berkas', 'error');
    }
  };

  // Rename File
  const handleRename = async (fileId: string, newName: string) => {
    const ok = await renameFileOnServer(fileId, newName);
    if (ok) {
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
    } else {
      addToast('Gagal mengubah nama berkas', 'error');
    }
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
      addToast('Tautan drive cloud berhasil disalin! Siapa pun yang membuka tautan dapat melihat berkas.', 'success');
    } else {
      addToast('Tautan publik: ' + window.location.href, 'info');
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
        fileCount={files.length}
      />

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
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
            onDownloadSelectedFiles={handleDownloadSelected}
            onRenameFile={(f) => setFileToRename(f)}
            onDeleteFile={(f) => setFileToDelete(f)}
            onBatchDeletePrompt={() => setIsBatchDeleteModalOpen(true)}
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
            className={`transition cursor-pointer ${currentView === 'home' ? 'text-blue-400' : 'hover:text-white'}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('manager')}
            className={`transition cursor-pointer ${currentView === 'manager' ? 'text-blue-400' : 'hover:text-white'}`}
          >
            File Manager
          </button>
          <a href="mailto:rikasma009@gmail.com" className="hover:text-white transition">
            Contact: rikasma009@gmail.com
          </a>
        </div>

        {/* Social Icons (TikTok, Instagram, WhatsApp) */}
        <div className="flex items-center justify-center space-x-3 pt-1">
          {/* TikTok */}
          <a
            id="footerLinkTiktok"
            href="https://www.tiktok.com/@wp_septa"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#131d3b] border border-[#1e2c54] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-[#18244d] transition"
            title="TikTok: @wp_septa"
            aria-label="TikTok: @wp_septa"
          >
            <Music2 className="w-4 h-4" />
          </a>

          {/* Instagram */}
          <a
            id="footerLinkInstagram"
            href="https://www.instagram.com/wp_septaa/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#131d3b] border border-[#1e2c54] text-slate-300 hover:text-pink-400 hover:border-pink-500/40 hover:bg-[#18244d] transition"
            title="Instagram: @wp_septaa"
            aria-label="Instagram: @wp_septaa"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* WhatsApp */}
          <a
            id="footerLinkWhatsApp"
            href="https://wa.me/817089287819"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#131d3b] border border-[#1e2c54] text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-[#18244d] transition"
            title="WhatsApp: +81 70-8928-7819"
            aria-label="WhatsApp: +81 70-8928-7819"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        <div className="text-slate-400 pt-1">
          FileKu © 2026 • Created by{' '}
          <span className="text-slate-200 font-medium">WP septa</span>
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

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
