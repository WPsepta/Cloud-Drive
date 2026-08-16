import React from 'react';
import {
  X,
  Download,
  FileText,
  FileCode,
  Calendar,
  HardDrive,
  Globe,
  Lock,
} from 'lucide-react';
import { StoredFile } from '../types';
import { formatBytes, getFileCategory } from '../utils/formatters';

interface FilePreviewModalProps {
  file: StoredFile | null;
  onClose: () => void;
  onDownload: (file: StoredFile) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onDownload,
}) => {
  if (!file) return null;

  const category = getFileCategory(file.name);

  return (
    <div
      id="previewModalBackdrop"
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div
        id="previewModalCard"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#131d3b] border border-[#1e2c54] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1e2c54] bg-[#0b1329]/60">
          <div className="flex items-center space-x-3 overflow-hidden pr-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              {category === 'code' ? <FileCode className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-white text-sm sm:text-base truncate">{file.name}</h2>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>{formatBytes(file.size)}</span>
                <span>•</span>
                <span className="uppercase text-slate-300 font-semibold">{file.type}</span>
              </div>
            </div>
          </div>

          <button
            id="btnClosePreviewModal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-[#1e2c54] transition shrink-0"
            aria-label="Tutup Pratinjau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#0b1329]/40">
          {category === 'image' && file.previewUrl ? (
            <div className="max-h-[60vh] flex items-center justify-center rounded-xl overflow-hidden border border-[#1e2c54] bg-black/40">
              <img
                src={file.previewUrl}
                alt={file.name}
                referrerPolicy="no-referrer"
                className="max-h-[55vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : category === 'code' || category === 'document' ? (
            <div className="w-full bg-[#0b1329] border border-[#1e2c54] rounded-2xl p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[50vh] whitespace-pre-wrap leading-relaxed shadow-inner">
              {file.contentSnippet ? (
                <code>{file.contentSnippet}</code>
              ) : (
                <div className="text-slate-400 py-6 text-center italic">
                  Konten berkas biner/teks siap untuk diunduh.
                </div>
              )}
            </div>
          ) : category === 'media' && file.previewUrl && (file.type.includes('mp4') || file.type.includes('webm')) ? (
            <div className="w-full max-h-[55vh] rounded-2xl overflow-hidden bg-black border border-[#1e2c54]">
              <video src={file.previewUrl} controls className="w-full h-auto max-h-[50vh]" />
            </div>
          ) : category === 'media' && file.previewUrl ? (
            <div className="w-full p-6 bg-[#0b1329] border border-[#1e2c54] rounded-2xl flex flex-col items-center space-y-4">
              <audio src={file.previewUrl} controls className="w-full" />
            </div>
          ) : (
            <div className="p-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#1e2c54] text-slate-400 mx-auto flex items-center justify-center text-2xl">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Pratinjau langsung tidak tersedia untuk format ini</p>
                <p className="text-xs text-slate-400 mt-1">Silakan unduh berkas untuk membukanya di komputer Anda</p>
              </div>
            </div>
          )}

          {/* Details Table */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-4 border-t border-[#1e2c54] text-xs">
            <div className="bg-[#131d3b] p-2.5 rounded-xl border border-[#1e2c54]">
              <span className="text-[10px] text-slate-400 block">Ukuran</span>
              <span className="font-semibold text-slate-200">{formatBytes(file.size)}</span>
            </div>
            <div className="bg-[#131d3b] p-2.5 rounded-xl border border-[#1e2c54]">
              <span className="text-[10px] text-slate-400 block">Format</span>
              <span className="font-semibold text-slate-200 uppercase">{file.type || 'N/A'}</span>
            </div>
            <div className="bg-[#131d3b] p-2.5 rounded-xl border border-[#1e2c54]">
              <span className="text-[10px] text-slate-400 block">Diunggah</span>
              <span className="font-semibold text-slate-200 truncate block">{file.date}</span>
            </div>
            <div className="bg-[#131d3b] p-2.5 rounded-xl border border-[#1e2c54]">
              <span className="text-[10px] text-slate-400 block">Hak Akses</span>
              <span className="font-semibold text-emerald-400">{file.isPublic ? 'Publik' : 'Privat'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#1e2c54] bg-[#0b1329]/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1e2c54] transition"
          >
            Tutup
          </button>
          <button
            id="btnDownloadInPreview"
            onClick={() => onDownload(file)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition text-xs flex items-center space-x-2 shadow-md shadow-blue-600/30 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
