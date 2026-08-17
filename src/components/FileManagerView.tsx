import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Share2,
  Search,
  Upload,
  Trash2,
  Download,
  CheckSquare,
  Square,
  ArrowUpDown,
  Layers,
  LayoutGrid,
  List,
  Plus,
} from 'lucide-react';
import { StoredFile, SortField, SortOrder } from '../types';
import { FileItemRow } from './FileItemRow';
import { FileGridCard } from './FileGridCard';

interface FileManagerViewProps {
  files: StoredFile[];
  selectedFileIds: string[];
  onToggleSelect: (fileId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPreviewFile: (file: StoredFile) => void;
  onDownloadFile: (file: StoredFile) => void;
  onDownloadSelectedFiles: () => void;
  onRenameFile: (file: StoredFile) => void;
  onDeleteFile: (file: StoredFile) => void;
  onBatchDeletePrompt: () => void;
  onShareLink: () => void;
  onTriggerUpload: () => void;
  onDropFiles: (files: FileList | File[]) => void;
  uploadProgress: { isUploading: boolean; progress: number; currentFileName: string };
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({
  files,
  selectedFileIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onPreviewFile,
  onDownloadFile,
  onDownloadSelectedFiles,
  onRenameFile,
  onDeleteFile,
  onBatchDeletePrompt,
  onShareLink,
  onTriggerUpload,
  onDropFiles,
  uploadProgress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('list');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  // Filtered & Sorted files (search by name/extension, sorted by name or size)
  const processedFiles = useMemo(() => {
    return files
      .filter((file) => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = file.name.toLowerCase().includes(query);
          const matchesType = file.type.toLowerCase().includes(query);
          if (!matchesName && !matchesType) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === 'size') {
          cmp = a.size - b.size;
        } else if (sortField === 'date') {
          cmp = a.timestamp - b.timestamp;
        }
        return sortOrder === 'desc' ? -cmp : cmp;
      });
  }, [files, searchQuery, sortField, sortOrder]);

  const allFilteredSelected =
    processedFiles.length > 0 &&
    processedFiles.every((f) => selectedFileIds.includes(f.id));

  return (
    <div
      id="fileManagerViewContainer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 transition-colors ${
        isDraggingOver ? 'bg-blue-950/20' : ''
      }`}
    >
      {/* Drive Cloud Main Info Card */}
      <div className="bg-[#131d3b] border border-[#1e2c54] rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-blue-600/20 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">Drive Cloud FileKu</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span id="totalFolderItems" className="font-semibold text-slate-300">
                {files.length} berkas tersimpan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress Bar Card */}
      {uploadProgress.isUploading && (
        <div
          id="progressCard"
          className="bg-[#131d3b] border border-blue-500/40 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-xl animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex justify-between text-xs text-slate-200 font-medium">
            <span id="progressFilename" className="truncate pr-2">
              Mengunggah: {uploadProgress.currentFileName || 'Memproses berkas...'}
            </span>
            <span id="progressPercentage" className="font-mono text-blue-400 font-bold">
              {uploadProgress.progress}%
            </span>
          </div>
          <div className="w-full bg-[#0b1329] rounded-full h-3 overflow-hidden border border-[#1e2c54] p-0.5">
            <div
              id="progressBarFill"
              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-200 shadow-sm"
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 1 Kotak Terpadu: Checkbox (Tanpa Teks), Pencarian, Share Link, Urutan, dan Kotak/List */}
      <div
        id="unifiedControlToolbar"
        className="bg-[#131d3b] border border-[#1e2c54] rounded-2xl p-2.5 sm:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 shadow-xl"
      >
        {/* Bagian Kiri: Tombol Checkbox Pilih Semua (Tanpa Teks) + Input Pencarian */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Checkbox Icon Only (Tanpa Teks Pilih Semua) */}
          <button
            id="btnToggleSelectAllOnly"
            type="button"
            onClick={allFilteredSelected ? onDeselectAll : onSelectAll}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              allFilteredSelected
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                : 'bg-[#0b1329] border-[#1e2c54] text-slate-400 hover:text-white hover:border-slate-500'
            }`}
            title={allFilteredSelected ? 'Batalkan pilihan' : 'Pilih semua'}
            aria-label={allFilteredSelected ? 'Batalkan pilihan' : 'Pilih semua'}
          >
            {allFilteredSelected ? (
              <CheckSquare className="w-4 h-4 text-white" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>

          {/* Kotak Pencarian */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="inputSearchFiles"
              type="text"
              placeholder="Cari berkas (contoh: .exe, .bat, .pdf, .zip, .png)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b1329] border border-[#1e2c54] focus:border-blue-500 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Bagian Kanan: Aksi Pilihan (jika ada) + Ikon Share Link + Urutan + Mode Kotak/List */}
        <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* Tombol Aksi saat ada berkas yang dipilih */}
          {selectedFileIds.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0 animate-in fade-in">
              <span className="text-xs bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2 py-1 rounded-lg font-bold">
                {selectedFileIds.length}
              </span>
              <button
                id="btnBatchDownload"
                onClick={onDownloadSelectedFiles}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1.5 rounded-xl transition text-xs flex items-center space-x-1 shadow-sm active:scale-95 cursor-pointer"
                title="Unduh Berkas Terpilih"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh</span>
              </button>
              <button
                id="btnBatchDelete"
                onClick={onBatchDeletePrompt}
                className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-semibold px-2.5 py-1.5 rounded-xl transition text-xs flex items-center space-x-1 active:scale-95 cursor-pointer"
                title="Hapus Berkas Terpilih"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hapus</span>
              </button>
            </div>
          )}

          {/* Ikon Bagikan Tautan (Share Link) */}
          <button
            id="btnShareFolder"
            onClick={onShareLink}
            className="p-2 text-slate-300 hover:text-white bg-[#0b1329] hover:bg-[#1e2c54] border border-[#1e2c54] hover:border-blue-500/40 rounded-xl transition shrink-0 cursor-pointer"
            title="Bagikan Tautan Folder"
            aria-label="Bagikan Tautan Folder"
          >
            <Share2 className="w-4 h-4 text-blue-400" />
          </button>

          {/* Urutan Berdasarkan (Sort) */}
          <div className="flex items-center bg-[#0b1329] border border-[#1e2c54] rounded-xl p-0.5 text-xs shrink-0">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#1e2c54] transition cursor-pointer"
              title={`Urutan: ${sortOrder === 'asc' ? 'Menaik (A-Z)' : 'Menurun (Z-A)'}`}
              aria-label="Ubah arah urutan"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="bg-transparent text-slate-300 text-xs px-1.5 py-1 focus:outline-none cursor-pointer"
              aria-label="Urutkan berdasarkan"
            >
              <option value="name" className="bg-[#131d3b] text-white">Nama</option>
              <option value="size" className="bg-[#131d3b] text-white">Ukuran</option>
            </select>
          </div>

          {/* Mode Tampilan Kotak atau List */}
          <div className="flex items-center bg-[#0b1329] border border-[#1e2c54] rounded-xl p-0.5 text-xs shrink-0">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kotak"
              aria-label="Tampilan Kotak"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan List"
              aria-label="Tampilan List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Files Display (Grid or List) */}
      {processedFiles.length > 0 ? (
        layoutMode === 'grid' ? (
          /* Grid View of File Cards */
          <div
            id="fileGrid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {processedFiles.map((file) => (
              <FileGridCard
                key={file.id}
                file={file}
                isSelected={selectedFileIds.includes(file.id)}
                onToggleSelect={onToggleSelect}
                onPreview={onPreviewFile}
                onDownload={onDownloadFile}
                onRename={onRenameFile}
                onDelete={onDeleteFile}
              />
            ))}
          </div>
        ) : (
          /* List Table View */
          <div className="bg-[#131d3b] border border-[#1e2c54] rounded-3xl shadow-xl">
            <div id="fileListContainer" className="divide-y divide-[#1e2c54] flex flex-col">
              {processedFiles.map((file) => (
                <FileItemRow
                  key={file.id}
                  file={file}
                  isSelected={selectedFileIds.includes(file.id)}
                  onToggleSelect={onToggleSelect}
                  onPreview={onPreviewFile}
                  onDownload={onDownloadFile}
                  onRename={onRenameFile}
                  onDelete={onDeleteFile}
                />
              ))}
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div
          id="emptyStateNotice"
          onClick={onTriggerUpload}
          className="p-16 sm:p-20 text-center text-slate-400 text-sm flex flex-col items-center justify-center space-y-4 cursor-pointer bg-[#131d3b]/50 border border-[#1e2c54] rounded-3xl hover:bg-[#18244d]/40 transition shadow-xl"
        >
          <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl shadow-inner">
            {searchQuery ? (
              <Layers className="w-8 h-8" />
            ) : (
              <FolderOpen className="w-8 h-8 text-amber-400" />
            )}
          </div>
          <div className="space-y-1 max-w-sm">
            <p className="font-bold text-white text-base">
              {searchQuery
                ? 'Tidak ada berkas yang cocok'
                : 'Belum ada berkas di drive cloud'}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {searchQuery
                ? 'Coba ganti kata kunci pencarian berkas'
                : 'Ketuk atau seret & jatuhkan berkas ke sini untuk mulai mengunggah'}
            </p>
          </div>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl transition text-xs flex items-center space-x-2 shadow-md shadow-blue-600/30"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah Berkas Sekarang</span>
          </button>
        </div>
      )}

      {/* Floating Action Button for Quick Upload */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          id="btnFloatingUpload"
          onClick={onTriggerUpload}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-2xl shadow-blue-600/50 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30"
          title="Unggah Berkas Baru"
          aria-label="Unggah Berkas Baru"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
