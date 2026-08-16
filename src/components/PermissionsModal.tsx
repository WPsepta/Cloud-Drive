import React, { useState } from 'react';
import { ShieldCheck, X, Globe, Lock, Share2, Copy, Check } from 'lucide-react';
import { PermissionSettings } from '../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PermissionSettings;
  onSave: (newSettings: PermissionSettings) => void;
  onShareLink: () => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onShareLink,
}) => {
  const [currentSettings, setCurrentSettings] = useState<PermissionSettings>(settings);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    onShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  return (
    <div
      id="permissionsModalBackdrop"
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div
        id="permissionsModalCard"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#131d3b] border border-[#1e2c54] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative"
      >
        <button
          id="btnClosePermissionsModal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-[#1e2c54] pb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Access & Permissions</h3>
            <p className="text-xs text-slate-400">Atur hak akses dan izin drive cloud Anda</p>
          </div>
        </div>

        {/* Share URL Box */}
        <div className="bg-[#0b1329] p-3 rounded-2xl border border-[#1e2c54] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-medium flex items-center space-x-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Tautan Drive Cloud Publik</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : 'https://fileku.storage'}
              className="flex-1 bg-[#131d3b] text-slate-300 text-xs px-3 py-2 rounded-xl border border-[#1e2c54] focus:outline-none select-all truncate font-mono"
            />
            <button
              id="btnCopyDriveLinkInModal"
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition shrink-0"
              title="Salin Tautan"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Settings switches */}
        <div className="space-y-3">
          <label className="flex items-center justify-between bg-[#0b1329] p-3.5 rounded-2xl border border-[#1e2c54] cursor-pointer hover:border-slate-600 transition">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Status Publik</p>
                <p className="text-[11px] text-slate-400">Siapa pun yang memiliki tautan dapat melihat berkas</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={currentSettings.isPublic}
              onChange={(e) =>
                setCurrentSettings({ ...currentSettings, isPublic: e.target.checked })
              }
              className="w-5 h-5 rounded border-[#1e2c54] bg-[#131d3b] text-blue-600 focus:ring-blue-500/30 cursor-pointer accent-blue-600"
            />
          </label>

          <label className="flex items-center justify-between bg-[#0b1329] p-3.5 rounded-2xl border border-[#1e2c54] cursor-pointer hover:border-slate-600 transition">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Proteksi Kata Sandi</p>
                <p className="text-[11px] text-slate-400">Memerlukan kata sandi untuk mengunduh</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={currentSettings.passwordProtected}
              onChange={(e) =>
                setCurrentSettings({
                  ...currentSettings,
                  passwordProtected: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-[#1e2c54] bg-[#131d3b] text-blue-600 focus:ring-blue-500/30 cursor-pointer accent-blue-600"
            />
          </label>

          {currentSettings.passwordProtected && (
            <div className="p-3 bg-[#0b1329] rounded-2xl border border-[#1e2c54] animate-in fade-in space-y-1.5">
              <label className="text-[11px] text-slate-400 block font-medium">Kata Sandi Drive</label>
              <input
                type="password"
                placeholder="Masukkan kata sandi perlindungan"
                value={currentSettings.password || ''}
                onChange={(e) =>
                  setCurrentSettings({ ...currentSettings, password: e.target.value })
                }
                className="w-full bg-[#131d3b] border border-[#1e2c54] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          id="btnSavePermissions"
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition text-xs shadow-lg shadow-blue-600/30"
        >
          Simpan Pengaturan Izin
        </button>
      </div>
    </div>
  );
};
