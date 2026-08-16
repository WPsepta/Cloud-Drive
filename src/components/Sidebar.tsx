import React from 'react';
import {
  FolderOpen,
  X,
  Home,
  HardDrive,
  Mail,
  ShieldCheck,
  ExternalLink,
  PieChart,
  Trash2,
} from 'lucide-react';
import { ViewMode } from '../types';
import { formatBytes } from '../utils/formatters';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenPermissions: () => void;
  totalFiles: number;
  totalSize: number;
  onClearAllPrompt?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  onOpenPermissions,
  totalFiles,
  totalSize,
  onClearAllPrompt,
}) => {
  const maxStorageBytes = 100 * 1024 * 1024; // 100MB representation
  const usagePercentage = Math.min(100, Math.max(1, Math.round((totalSize / maxStorageBytes) * 100)));

  return (
    <>
      {/* Backdrop */}
      <div
        id="sidebarBackdrop"
        onClick={onClose}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        id="sidebarDrawer"
        className={`fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-[#131d3b] border-r border-[#1e2c54] z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-5 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5">
          {/* Top Brand & Close */}
          <div className="flex items-center justify-between border-b border-[#1e2c54] pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FolderOpen className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">FileKu</span>
            </div>
            <button
              id="btnCloseSidebar"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1e2c54] transition"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-[#0b1329] border border-[#1e2c54] p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shrink-0 relative shadow-md">
                <span>W</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b1329] rounded-full"></div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">WP septa</p>
                <p className="text-xs text-slate-400 truncate">rikasma009@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <button
              id="menuHomeLink"
              onClick={() => {
                onViewChange('home');
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                currentView === 'home'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-[#1e2c54] hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Home</span>
            </button>

            <button
              id="menuManagerLink"
              onClick={() => {
                onViewChange('manager');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                currentView === 'manager'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-[#1e2c54] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span>File Manager (Drive)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e2c54] text-slate-300">
                {totalFiles}
              </span>
            </button>

            <button
              id="menuPermissionsLink"
              onClick={() => {
                onOpenPermissions();
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-[#1e2c54] hover:text-white transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Access & Permissions</span>
            </button>

            <a
              id="menuContactLink"
              href="mailto:rikasma009@gmail.com"
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-[#1e2c54] hover:text-white transition"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Kontak Dukungan</span>
            </a>
          </nav>

          {/* Storage Meter Widget */}
          <div className="bg-[#0b1329]/80 border border-[#1e2c54] p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-1.5">
                <PieChart className="w-3.5 h-3.5 text-blue-400" />
                <span>Kapasitas Drive</span>
              </div>
              <span className="text-blue-400 font-semibold">{usagePercentage}%</span>
            </div>
            <div className="w-full bg-[#18244d] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{formatBytes(totalSize)} terpakai</span>
              <span>{totalFiles} file aktif</span>
            </div>

            {totalFiles > 0 && onClearAllPrompt && (
              <button
                id="btnSidebarClearAll"
                onClick={() => {
                  onClose();
                  onClearAllPrompt();
                }}
                className="w-full mt-2 pt-2 border-t border-[#1e2c54] text-[11px] text-rose-400 hover:text-rose-300 flex items-center justify-center space-x-1.5 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Bersihkan semua berkas</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#1e2c54] pt-4 text-xs text-slate-400 flex items-center justify-between">
          <a
            href="https://tiktok.com/@wp_septa"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition flex items-center space-x-1.5"
          >
            <span className="font-semibold text-slate-200">TikTok:</span>
            <span className="text-blue-400">@wp_septa</span>
          </a>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </aside>
    </>
  );
};
