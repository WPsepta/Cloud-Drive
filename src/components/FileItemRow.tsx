import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Edit2,
  Check,
} from 'lucide-react';
import { StoredFile } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';
import { FileFormatIcon } from './FileFormatIcon';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Real-time Indonesian date display from timestamp
  const dateDisplay = file.timestamp
    ? formatDate(new Date(file.timestamp))
    : file.date || formatDate(new Date());

  return (
    <div
      id={`file-row-${file.id}`}
      className={`group relative flex items-center justify-between px-3.5 sm:px-4 py-3 sm:py-3.5 transition-colors ${
        isMenuOpen ? 'z-20' : 'z-0'
      } ${
        isSelected
          ? 'bg-[#18244d]/90'
          : 'hover:bg-[#18244d]/50 bg-transparent'
      }`}
    >
      {/* Left side: Checkbox + Format-specific Icon + File Information */}
      <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-1 pr-2">
        {/* Custom Rounded Squarish Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(file.id);
          }}
          className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
            isSelected
              ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
              : 'border-slate-500/70 hover:border-blue-400 bg-transparent'
          }`}
          aria-label={`Pilih ${file.name}`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
        </button>

        {/* Distinct format icon based on file extension */}
        <div
          onClick={() => onPreview(file)}
          className="w-8 h-8 rounded-xl bg-[#0b1329] border border-[#1e2c54] flex items-center justify-center shrink-0 cursor-pointer select-none hover:scale-105 hover:border-blue-400 transition"
          title={`Pratinjau ${file.name}`}
        >
          <FileFormatIcon filename={file.name} size="sm" />
        </div>

        {/* Text Metadata: Name on top, Calendar Date + Size on bottom */}
        <div className="min-w-0 flex-1">
          <p
            onClick={() => onPreview(file)}
            className="font-semibold text-sm sm:text-[15px] text-slate-100 truncate hover:text-blue-400 cursor-pointer transition"
            title={file.name}
          >
            {file.name}
          </p>

          <div className="flex items-center space-x-2.5 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center space-x-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="whitespace-nowrap">{dateDisplay}</span>
            </span>
            <span className="font-mono text-slate-300 whitespace-nowrap shrink-0">{formatBytes(file.size)}</span>
          </div>
        </div>
      </div>

      {/* Right side: Quick Download Button + 3-dots Menu Button */}
      <div className="flex items-center space-x-1 shrink-0">
        {/* Direct Download Button (Desktop only, hidden on mobile/android) */}
        <button
          id={`btn-download-${file.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(file);
          }}
          className="hidden md:inline-flex p-2 text-slate-400 hover:text-emerald-400 hover:bg-[#1e2c54] rounded-xl transition cursor-pointer"
          title={`Unduh ${file.name}`}
          aria-label={`Unduh ${file.name}`}
        >
          <Download className="w-4 h-4" />
        </button>

        {/* 3-dots Menu Button */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            id={`btn-menu-${file.id}`}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isMenuOpen
                ? 'bg-blue-600/30 text-white border border-blue-500/40'
                : 'text-slate-400 hover:text-white hover:bg-[#1e2c54]'
            }`}
            title="Opsi Berkas"
            aria-label="Opsi Berkas"
            aria-expanded={isMenuOpen}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Popup Menu (Fixed high z-index and positioned clearly) */}
          {isMenuOpen && (
            <div
              id={`dropdown-menu-${file.id}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1.5 w-44 bg-[#0b1329] border border-[#1e2c54] rounded-2xl shadow-2xl py-1.5 z-50 ring-1 ring-black/50 animate-in fade-in zoom-in-95 duration-100"
            >
              {/* Pratinjau */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onPreview(file);
                }}
                className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1e2c54] hover:text-white flex items-center space-x-2.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Pratinjau</span>
              </button>

              {/* Unduh */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDownload(file);
                }}
                className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1e2c54] hover:text-white flex items-center space-x-2.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Unduh</span>
              </button>

              {/* Ganti Nama */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onRename(file);
                }}
                className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-[#1e2c54] hover:text-white flex items-center space-x-2.5 transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Ganti Nama</span>
              </button>

              <div className="my-1 border-t border-[#1e2c54]" />

              {/* Hapus */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDelete(file);
                }}
                className="w-full px-3.5 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/15 flex items-center space-x-2.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
