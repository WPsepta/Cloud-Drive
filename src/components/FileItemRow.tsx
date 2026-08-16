import React from 'react';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  FileVideo,
  FileAudio,
  FileImage,
  Download,
  Trash2,
  Eye,
  Edit2,
  Globe,
  Lock,
} from 'lucide-react';
import { StoredFile } from '../types';
import { formatBytes, getFileCategory, getFileTypeBadgeColor } from '../utils/formatters';

interface FileItemRowProps {
  file: StoredFile;
  isSelected: boolean;
  onToggleSelect: (fileId: string) => void;
  onPreview: (file: StoredFile) => void;
  onDownload: (file: StoredFile) => void;
  onRename: (file: StoredFile) => void;
  onDelete: (file: StoredFile) => void;
}

export const FileItemRow: React.FC<FileItemRowProps> = ({
  file,
  isSelected,
  onToggleSelect,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}) => {
  const category = getFileCategory(file.name);
  const badgeColors = getFileTypeBadgeColor(file.type);

  // Render appropriate category icon
  const renderIcon = () => {
    switch (category) {
      case 'image':
        return <FileImage className="w-5 h-5 text-emerald-400" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-amber-400" />;
      case 'document':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'archive':
        return <FileArchive className="w-5 h-5 text-purple-400" />;
      case 'media':
        return file.type.includes('mp4') || file.type.includes('mkv') ? (
          <FileVideo className="w-5 h-5 text-sky-400" />
        ) : (
          <FileAudio className="w-5 h-5 text-indigo-400" />
        );
      default:
        return <FileSpreadsheet className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div
      id={`file-row-${file.id}`}
      className={`group flex items-center justify-between p-3.5 sm:p-4 hover:bg-[#18244d]/70 transition-all ${
        isSelected ? 'bg-[#18244d] border-l-4 border-blue-500' : ''
      }`}
    >
      {/* Left Area: Checkbox + Icon + Details */}
      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 pr-2 flex-1">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(file.id)}
          className="w-4 h-4 rounded border-[#1e2c54] bg-[#0b1329] text-blue-600 focus:ring-blue-500/30 cursor-pointer shrink-0"
          aria-label={`Pilih ${file.name}`}
        />

        {/* File Type Icon container */}
        <div
          onClick={() => onPreview(file)}
          className="w-10 h-10 rounded-xl bg-[#0b1329] border border-[#1e2c54] flex items-center justify-center shrink-0 cursor-pointer hover:border-blue-400 transition"
          title="Klik untuk pratinjau berkas"
        >
          {renderIcon()}
        </div>

        {/* Name and Meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <p
              onClick={() => onPreview(file)}
              className="font-medium text-xs sm:text-sm text-slate-100 truncate hover:text-blue-400 cursor-pointer transition"
              title={file.name}
            >
              {file.name}
            </p>

            {/* Public/Private Badge */}
            {file.isPublic ? (
              <span className="hidden sm:inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0">
                <Globe className="w-2.5 h-2.5" />
                <span>Publik</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0">
                <Lock className="w-2.5 h-2.5" />
                <span>Privat</span>
              </span>
            )}

            {/* Extension tag */}
            <span
              className={`hidden md:inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${badgeColors.bg} ${badgeColors.text} ${badgeColors.border}`}
            >
              {file.type || 'FILE'}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-400 mt-0.5">
            <span>{file.date}</span>
            <span>•</span>
            <span className="font-mono text-slate-300">{formatBytes(file.size)}</span>
          </div>
        </div>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center space-x-1 shrink-0">
        {/* Preview Button */}
        <button
          id={`btn-preview-${file.id}`}
          onClick={() => onPreview(file)}
          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-[#1e2c54] rounded-lg transition"
          title="Pratinjau Berkas"
          aria-label="Pratinjau Berkas"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Download Button */}
        <button
          id={`btn-download-${file.id}`}
          onClick={() => onDownload(file)}
          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-[#1e2c54] rounded-lg transition"
          title="Unduh Berkas"
          aria-label="Unduh Berkas"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Rename Button */}
        <button
          id={`btn-rename-${file.id}`}
          onClick={() => onRename(file)}
          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-[#1e2c54] rounded-lg transition"
          title="Ganti Nama"
          aria-label="Ganti Nama"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          id={`btn-delete-${file.id}`}
          onClick={() => onDelete(file)}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          title="Hapus Berkas"
          aria-label="Hapus Berkas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
