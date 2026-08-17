import React from 'react';
import { FolderOpen, Menu, Upload, HardDrive, Home } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onToggleSidebar: () => void;
  onTriggerUpload: () => void;
  fileCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onToggleSidebar,
  onTriggerUpload,
  fileCount,
}) => {
  return (
    <header className="h-16 bg-[#0b1329]/95 backdrop-blur-md border-b border-[#1e2c54] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left side: Hamburger & Logo */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          id="btnToggleSidebar"
          onClick={onToggleSidebar}
          className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-[#1e2c54] transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          id="btnLogoHome"
          onClick={() => onViewChange('home')}
          className="flex items-center space-x-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition shadow-inner">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">FileKu</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 hidden sm:inline-block">
                Cloud
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">Storage Platform</p>
          </div>
        </button>
      </div>

      {/* Center Nav tabs on desktop */}
      <nav className="hidden md:flex items-center space-x-1 bg-[#131d3b] p-1 rounded-xl border border-[#1e2c54]">
        <button
          id="navTabHome"
          onClick={() => onViewChange('home')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            currentView === 'home'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#1e2c54]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <button
          id="navTabManager"
          onClick={() => onViewChange('manager')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            currentView === 'manager'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#1e2c54]'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>File Manager</span>
          {fileCount > 0 && (
            <span className="px-1.5 py-0.2 bg-white/20 text-[10px] font-semibold rounded-full">
              {fileCount}
            </span>
          )}
        </button>
      </nav>

      {/* Right side placeholder / space */}
      <div className="flex items-center space-x-2 sm:space-x-3"></div>
    </header>
  );
};
