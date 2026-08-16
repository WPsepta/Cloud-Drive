import React, { useState, useMemo } from 'react';
import {
  HardDrive,
  Calendar,
  Share2,
  ShieldCheck,
  Search,
  Upload,
  Trash2,
  CheckSquare,
  Square,
  ArrowUpDown,
  Filter,
  Layers,
  FolderOpen,
} from 'lucide-react';
import { StoredFile, FileFilter, SortField, SortOrder } from '../types';
import { FileItemRow } from './FileItemRow';
import { getFileCategory } from '../utils/formatters';

interface FileManagerViewProps {
  files: StoredFile[];
  selectedFileIds: string[];
  onToggleSelect: (fileId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPreviewFile: (file: StoredFile) => void;
  onDownloadFile: (file: StoredFile) => void;
  onRenameFile: (file: StoredFile) => void;
  onDeleteFile: (file: StoredFile) => void;
  onBatchDeletePrompt: () => void;
  onOpenPermissions: () => void;
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
  onRenameFile,
  onDeleteFile,
  onBatchDeletePrompt,
  onOpenPermissions,
  onShareLink,
  onTriggerUpload,
  onDropFiles,
  uploadProgress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FileFilter>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
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

  // Filtered & Sorted files
  const processedFiles = useMemo(() => {
    return files
      .filter((file) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = file.name.toLowerCase().includes(query);
          const matchesType = file.type.toLowerCase().includes(query);
          if (!matchesName && !matchesType) return false;
        }

        // Category filter
        if (activeFilter !== 'all') {
          const category = getFileCategory(file.name);
          if (category !== activeFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'date') {
          cmp = a.timestamp - b.timestamp;
        } else if (sortField === 'name') {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === 'size') {
          cmp = a.size - b.size;
        }
        return sortOrder === 'desc' ? -cmp : cmp;
      });
  }, [files, searchQuery, activeFilter, sortField, sortOrder]);

  const allFilteredSelected =
    processedFiles.length > 0 &&
    processedFiles.every((f) => selectedFileIds.includes(f.id));

  return (
    <div
      id="fileManagerViewContainer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 py-6 space-y-5 transition-colors ${
        isDraggingOver ? 'bg-blue-950/20' : ''
      }`}
    >
      {/* Drive Cloud Main Info Card */}
      <div className="bg-[#131d3b] border border-[#1e2c54] rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0">
            <HardDrive className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">Drive Cloud</h2>
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>23 Jul 2026, 01.39</span>
              </span>
              <span>•</span>
              <span id="totalFolderItems" className="font-semibold text-slate-300">
                {files.length} berkas
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            id="btnShareFolder"
            onClick={onShareLink}
            className="p-3 text-blue-400 hover:text-white hover:bg-[#1e2c54] rounded-2xl transition border border-[#1e2c54] hover:border-blue-500/30"
            title="Bagikan Tautan Folder"
            aria-label="Bagikan Tautan Folder"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            id="btnOpenPermissions"
            onClick={onOpenPermissions}
            className="px-3.5 py-2.5 bg-[#0b1329] hover:bg-[#1e2c54] text-slate-300 hover:text-white rounded-2xl transition border border-[#1e2c54] flex items-center space-x-2 text-xs font-semibold"
            title="Atur Hak Akses & Izin"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Access & permissions</span>
          </button>

          <button
            id="btnTriggerUploadManager"
            onClick={onTriggerUpload}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition text-xs font-semibold flex items-center space-x-2 shadow-md shadow-blue-600/30 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah</span>
          </button>
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

      {/* Search & Filter & Sort Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="inputSearchFiles"
              type="text"
              placeholder="Cari berkas berdasarkan nama atau ekstensi (.png, .bat, .txt)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131d3b] border border-[#1e2c54] focus:border-blue-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded"
              >
                Reset
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center bg-[#131d3b] border border-[#1e2c54] rounded-2xl p-1 text-xs">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-[#1e2c54] transition"
                title={`Urutan: ${sortOrder === 'asc' ? 'Menaik (Asc)' : 'Menurun (Desc)'}`}
              >
                <ArrowUpDown className="w-4 h-4 text-blue-400" />
              </button>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="bg-transparent text-slate-300 text-xs px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="date" className="bg-[#131d3b] text-white">Tanggal</option>
                <option value="name" className="bg-[#131d3b] text-white">Nama</option>
                <option value="size" className="bg-[#131d3b] text-white">Ukuran</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center space-x-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Kategori:</span>
          </span>
          {[
            { key: 'all', label: 'Semua' },
            { key: 'code', label: 'Skrip & Kode' },
            { key: 'document', label: 'Dokumen' },
            { key: 'image', label: 'Gambar' },
            { key: 'archive', label: 'Arsip' },
            { key: 'media', label: 'Audio / Video' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key as FileFilter)}
              className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
                activeFilter === cat.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#131d3b] text-slate-300 hover:text-white hover:bg-[#18244d] border border-[#1e2c54]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Action Bar (Visible when files are selected) */}
      {selectedFileIds.length > 0 && (
        <div className="bg-[#1e2c54] border border-blue-500/40 rounded-2xl p-3 sm:px-4 flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-3 text-xs text-slate-200">
            <span className="font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full text-[11px]">
              {selectedFileIds.length}
            </span>
            <span>berkas dipilih</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onDeselectAll}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#131d3b] transition"
            >
              Batal Pilih
            </button>
            <button
              id="btnBatchDelete"
              onClick={onBatchDeletePrompt}
              className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus ({selectedFileIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* File List Table Container */}
      <div className="bg-[#131d3b] border border-[#1e2c54] rounded-3xl overflow-hidden shadow-xl">
        {/* Table Header */}
        {files.length > 0 && (
          <div className="flex items-center justify-between p-3.5 sm:px-4 bg-[#0b1329]/80 border-b border-[#1e2c54] text-xs font-semibold text-slate-400">
            <div className="flex items-center space-x-3">
              <button
                onClick={allFilteredSelected ? onDeselectAll : onSelectAll}
                className="p-1 hover:text-white transition flex items-center space-x-2"
                title={allFilteredSelected ? 'Batalkan pilihan semua' : 'Pilih semua berkas'}
              >
                {allFilteredSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-[11px] font-medium text-slate-300 hidden sm:inline">
                  {allFilteredSelected ? 'Batalkan Semua' : 'Pilih Semua'}
                </span>
              </button>
            </div>
            <div className="text-[11px] text-slate-400">
              Menampilkan {processedFiles.length} dari {files.length} berkas
            </div>
          </div>
        )}

        {/* File Rows or Empty state */}
        <div id="fileListContainer" className="divide-y divide-[#1e2c54] flex flex-col">
          {processedFiles.length > 0 ? (
            processedFiles.map((file) => (
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
            ))
          ) : (
            <div
              id="emptyStateNotice"
              onClick={onTriggerUpload}
              className="p-12 sm:p-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-[#18244d]/40 transition"
            >
              <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-2xl shadow-inner">
                {searchQuery || activeFilter !== 'all' ? (
                  <Layers className="w-8 h-8" />
                ) : (
                  <FolderOpen className="w-8 h-8" />
                )}
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="font-bold text-white text-base">
                  {searchQuery || activeFilter !== 'all'
                    ? 'Tidak ada berkas yang cocok'
                    : 'Belum ada berkas di drive cloud'}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {searchQuery || activeFilter !== 'all'
                    ? 'Coba ganti kata kunci pencarian atau bersihkan filter kategori'
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
        </div>
      </div>
    </div>
  );
};
