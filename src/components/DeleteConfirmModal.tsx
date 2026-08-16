import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { StoredFile } from '../types';
import { formatBytes } from '../utils/formatters';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  fileToDelete: StoredFile | null;
  selectedCount?: number;
  isBatch?: boolean;
  isClearAll?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  fileToDelete,
  selectedCount = 0,
  isBatch = false,
  isClearAll = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="deleteModalBackdrop"
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div
        id="deleteModalCard"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#131d3b] border border-rose-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative"
      >
        {/* Close button */}
        <button
          id="btnCloseDeleteModal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              {isClearAll
                ? 'Hapus Semua Berkas?'
                : isBatch
                ? `Hapus ${selectedCount} Berkas Terpilih?`
                : 'Hapus Berkas Ini?'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Tindakan ini permanen dan tidak dapat dibatalkan</p>
          </div>
        </div>

        {/* Item context */}
        {!isBatch && !isClearAll && fileToDelete && (
          <div className="bg-[#0b1329] border border-[#1e2c54] rounded-xl p-3 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-semibold text-slate-200 truncate">{fileToDelete.name}</p>
              <p className="text-[11px] text-slate-400">{formatBytes(fileToDelete.size)}</p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {fileToDelete.type}
            </span>
          </div>
        )}

        {isBatch && (
          <div className="bg-[#0b1329] border border-[#1e2c54] rounded-xl p-3 text-xs text-slate-300">
            Anda akan menghapus <span className="font-bold text-rose-400">{selectedCount} berkas</span> secara massal dari penyimpanan drive cloud.
          </div>
        )}

        {isClearAll && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-200 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>Seluruh data berkas di drive cloud ini akan dibersihkan secara total.</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            id="btnCancelDelete"
            onClick={onClose}
            className="flex-1 bg-[#1e2c54] hover:bg-[#25376d] text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition text-xs"
          >
            Batal
          </button>
          <button
            id="btnConfirmDelete"
            onClick={onConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 px-4 rounded-xl transition text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-600/30 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
