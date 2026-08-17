import React from 'react';
import {
  X,
  Download,
} from 'lucide-react';
import { StoredFile } from '../types';
import { formatBytes, formatDate, getFileCategory } from '../utils/formatters';
import { FileFormatIcon } from './FileFormatIcon';

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
  const [asyncText, setAsyncText] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file) {
      setAsyncText(null);
      return;
    }
    const category = getFileCategory(file.name);
    if ((category === 'code' || category === 'document') && !file.contentSnippet && file.previewUrl) {
      fetch(file.previewUrl)
        .then((r) => r.text())
        .then((txt) => setAsyncText(txt.slice(0, 5000)))
        .catch(() => setAsyncText(null));
    } else {
      setAsyncText(null);
    }
  }, [file]);

  if (!file) return null;

  const category = getFileCategory(file.name);
  const textToDisplay = file.contentSnippet || asyncText;
  const dateDisplay = file.timestamp
    ? formatDate(new Date(file.timestamp))
    : file.date || formatDate(new Date());

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
            <div className="w-10 h-10 rounded-xl bg-[#0b1329] border border-[#1e2c54] flex items-center justify-center shrink-0">
              <FileFormatIcon filename={file.name} size="md" />
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
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-[#1e2c54] transition shrink-0 cursor-pointer"
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
              {textToDisplay ? (
                <code>{textToDisplay}</code>
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
              <div className="w-16 h-16 rounded-2xl bg-[#0b1329] border border-[#1e2c54] mx-auto flex items-center justify-center text-2xl">
                <FileFormatIcon filename={file.name} size="lg" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Pratinjau visual langsung tidak tersedia untuk format ini</p>
                <p className="text-xs text-slate-400 mt-1">Silakan unduh berkas untuk membukanya langsung di perangkat Anda</p>
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
              <span className="font-semibold text-slate-200 truncate block">{dateDisplay}</span>
            </div>
            <div className="bg-[#131d3b] p-2.5 rounded-xl border border-[#1e2c54]">
              <span className="text-[10px] text-slate-400 block">Penyimpanan</span>
              <span className="font-semibold text-blue-400">Cloud Storage</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#1e2c54] bg-[#0b1329]/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1e2c54] transition cursor-pointer"
          >
            Tutup
          </button>
          <button
            id="btnDownloadInPreview"
            onClick={() => onDownload(file)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition text-xs flex items-center space-x-2 shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
