import React from 'react';
import {
  Download,
  Trash2,
  Eye,
  Edit2,
  Calendar,
} from 'lucide-react';
import { StoredFile } from '../types';
import { formatBytes, formatDate, getDetailedFileInfo } from '../utils/formatters';
import { FileFormatIcon } from './FileFormatIcon';

interface FileGridCardProps {
  file: StoredFile;
  isSelected: boolean;
  onToggleSelect: (fileId: string) => void;
  onPreview: (file: StoredFile) => void;
  onDownload: (file: StoredFile) => void;
  onRename: (file: StoredFile) => void;
  onDelete: (file: StoredFile) => void;
}

export const FileGridCard: React.FC<FileGridCardProps> = ({
  file,
  isSelected,
  onToggleSelect,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}) => {
  const fileInfo = getDetailedFileInfo(file.name);
  const dateDisplay = file.timestamp
    ? formatDate(new Date(file.timestamp))
    : file.date || formatDate(new Date());

  return (
    <div
      id={`file-card-${file.id}`}
      className={`relative group bg-[#131d3b]/90 hover:bg-[#18244d] border ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-[#18244d]'
          : 'border-[#1e2c54] hover:border-slate-600'
      } rounded-3xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between`}
    >
      {/* Top row: Checkbox & Timestamp */}
      <div className="flex items-center justify-between mb-4">
        {/* Select checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(file.id);
          }}
          className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
            isSelected
              ? 'bg-blue-600 border-blue-500 text-white shadow-md'
              : 'bg-[#0b1329] border-[#1e2c54] hover:border-blue-400'
          }`}
          aria-label={`Pilih ${file.name}`}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 rounded-sm bg-white" />
          )}
        </button>

        {/* Real-time date display (No Publik text) */}
        <span className="inline-flex items-center space-x-1 text-slate-400 text-[11px]">
          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate max-w-[120px]">{dateDisplay}</span>
        </span>
      </div>

      {/* Main Content Area: Icon + Format Badge + Name */}
      <div
        onClick={() => onPreview(file)}
        className="cursor-pointer space-y-3 pb-2"
        title="Klik untuk pratinjau berkas"
      >
        <div className="flex items-center space-x-3.5">
          <div
            className="w-12 h-12 rounded-2xl bg-[#0b1329] border border-[#1e2c54] flex items-center justify-center text-xl shadow-inner shrink-0 group-hover:scale-105 transition-transform"
          >
            <FileFormatIcon filename={file.name} size="lg" />
          </div>
          <div className="min-w-0 flex items-center space-x-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${fileInfo.badgeStyle}`}
            >
              {fileInfo.badgeText}
            </span>
            <span className="text-xs text-slate-300 font-mono whitespace-nowrap">
              {formatBytes(file.size)}
            </span>
          </div>
        </div>

        <div>
          <h3
            className="font-bold text-slate-100 text-sm truncate group-hover:text-blue-400 transition"
            title={file.name}
          >
            {file.name}
          </h3>
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="pt-3.5 border-t border-[#1e2c54] flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center space-x-1">
          {/* Preview button */}
          <button
            type="button"
            onClick={() => onPreview(file)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-[#0b1329] rounded-xl transition cursor-pointer"
            title="Pratinjau"
            aria-label="Pratinjau berkas"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Rename button */}
          <button
            type="button"
            onClick={() => onRename(file)}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-[#0b1329] rounded-xl transition cursor-pointer"
            title="Ganti Nama"
            aria-label="Ganti Nama berkas"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete button */}
          <button
            type="button"
            onClick={() => onDelete(file)}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-[#0b1329] rounded-xl transition cursor-pointer"
            title="Hapus"
            aria-label="Hapus berkas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Download Action Button */}
        <button
          type="button"
          onClick={() => onDownload(file)}
          className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-xl transition flex items-center space-x-1 text-xs font-semibold active:scale-95 cursor-pointer"
          title="Unduh Berkas"
          aria-label="Unduh Berkas"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
