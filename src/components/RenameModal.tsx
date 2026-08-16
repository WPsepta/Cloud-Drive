import React, { useState, useEffect } from 'react';
import { Edit2, X, Check } from 'lucide-react';
import { StoredFile } from '../types';

interface RenameModalProps {
  file: StoredFile | null;
  isOpen: boolean;
  onClose: () => void;
  onRename: (fileId: string, newName: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  file,
  isOpen,
  onClose,
  onRename,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (file) {
      setName(file.name);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== file.name) {
      onRename(file.id, name.trim());
    }
    onClose();
  };

  return (
    <div
      id="renameModalBackdrop"
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div
        id="renameModalCard"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#131d3b] border border-[#1e2c54] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Edit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Ubah Nama Berkas</h3>
            <p className="text-xs text-slate-400">Masukkan nama berkas baru</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Nama File</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full bg-[#0b1329] border border-[#1e2c54] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
              placeholder="nama_file.ext"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#1e2c54] hover:bg-[#25376d] text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!name.trim() || name.trim() === file.name}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl transition text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Nama</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
