import React, { useState } from 'react';
import {
  FolderOpen,
  CloudUpload,
  HardDrive,
  Shield,
  Zap,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { StoredFile } from '../types';
import { formatBytes } from '../utils/formatters';

interface HomeViewProps {
  files: StoredFile[];
  onTriggerUpload: () => void;
  onOpenManager: () => void;
  onDropFiles: (files: FileList | File[]) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  files,
  onTriggerUpload,
  onOpenManager,
  onDropFiles,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  const totalSize = files.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div id="homeViewContainer" className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Main Hero Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative bg-gradient-to-br from-[#131d3b] via-[#18244d] to-[#131d3b] border ${
          isDragging ? 'border-blue-400 bg-blue-900/30 ring-4 ring-blue-500/20' : 'border-[#1e2c54]'
        } rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden flex flex-col items-center text-center space-y-6 transition-all duration-200`}
      >
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl shadow-xl">
            <FolderOpen className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
            <CloudUpload className="w-4 h-4" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cloud Storage Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            FileKu Cloud Storage
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Simpan, kelola, pratinjau, dan hapus berkas publik Anda secara cepat dan stabil dengan indikator upload langsung.
          </p>
        </div>

        {/* Action Buttons & Dropzone note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-md">
          <button
            id="btnHeroUpload"
            onClick={onTriggerUpload}
            className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-7 rounded-xl transition text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 active:scale-98 cursor-pointer"
          >
            <CloudUpload className="w-5 h-5" />
            <span>Unggah Berkas</span>
          </button>

          <button
            id="btnHeroManager"
            onClick={onOpenManager}
            className="w-full sm:w-auto flex-1 bg-[#1e2c54] hover:bg-[#25376d] text-white font-semibold py-3.5 px-7 rounded-xl transition text-sm flex items-center justify-center space-x-2 border border-slate-700 active:scale-98 cursor-pointer"
          >
            <HardDrive className="w-5 h-5 text-amber-400" />
            <span>Buka Drive Cloud</span>
          </button>
        </div>

        {/* Drag and drop prompt */}
        <div className="border border-dashed border-[#1e2c54] hover:border-blue-500/50 bg-[#0b1329]/60 rounded-2xl p-4 w-full max-w-md transition text-xs text-slate-400 flex items-center justify-center space-x-2">
          <CloudUpload className="w-4 h-4 text-blue-400" />
          <span>Atau seret & jatuhkan (drag & drop) berkas ke sini</span>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#131d3b] border border-[#1e2c54] rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-white font-bold text-sm">Upload Cepat & Stabil</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mendukung berbagai jenis berkas sekaligus dengan indikator bar progres visual.
          </p>
        </div>

        <div className="bg-[#131d3b] border border-[#1e2c54] rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-white font-bold text-sm">Manajemen Berkas Aman</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hapus berkas tunggal atau hapus massal (batch delete) dengan konfirmasi keamanan.
          </p>
        </div>

        <div className="bg-[#131d3b] border border-[#1e2c54] rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-white font-bold text-sm">Pratinjau & Unduh Langsung</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lihat isi gambar dan kode langsung di browser serta unduh dokumen kapan pun.
          </p>
        </div>
      </div>

      {/* Quick Overview of Drive Status */}
      <div className="bg-[#131d3b] border border-[#1e2c54] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-[#1e2c54] text-amber-400 flex items-center justify-center text-xl shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Status Drive Cloud</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {files.length} berkas tersimpan • Total {formatBytes(totalSize)}
            </p>
          </div>
        </div>

        <button
          id="btnQuickViewDrive"
          onClick={onOpenManager}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1e2c54] hover:bg-blue-600 text-slate-200 hover:text-white transition text-xs font-semibold flex items-center justify-center space-x-2"
        >
          <span>Buka Pengelola Berkas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Files Preview List (if any) */}
      {files.length > 0 && (
        <div className="bg-[#131d3b] border border-[#1e2c54] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Berkas Terbaru</span>
            </h3>
            <button
              onClick={onOpenManager}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Lihat Semua ({files.length})
            </button>
          </div>

          <div className="divide-y divide-[#1e2c54]/70">
            {files.slice(0, 3).map((file) => (
              <div key={file.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0b1329] border border-[#1e2c54] flex items-center justify-center text-blue-400 shrink-0 text-xs font-bold uppercase">
                    {file.type.slice(0, 3)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{file.date} • {formatBytes(file.size)}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium shrink-0">
                  Publik
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
