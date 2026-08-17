import React from 'react';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  FileVideo,
  FileAudio,
  FileImage,
  Smartphone,
  Package,
  AppWindow,
  Presentation,
  Terminal,
  FileCog,
  FileQuestion,
  Database,
} from 'lucide-react';

interface FileFormatIconProps {
  filename: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FileFormatIcon: React.FC<FileFormatIconProps> = ({
  filename,
  className = '',
  size = 'md',
}) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  // Specific Icon and Color based on exact file extension
  switch (ext) {
    // Android Package
    case 'apk':
      return <Smartphone className={`${sizeClasses} text-emerald-400 ${className}`} />;

    // Compressed Archives
    case 'zip':
    case '7z':
    case '7zip':
      return <FileArchive className={`${sizeClasses} text-amber-400 ${className}`} />;
    case 'rar':
    case 'tar':
    case 'gz':
    case 'bz2':
    case 'xz':
      return <FileArchive className={`${sizeClasses} text-orange-400 ${className}`} />;
    case 'iso':
    case 'img':
      return <Package className={`${sizeClasses} text-violet-400 ${className}`} />;

    // Windows Executables & Scripts
    case 'exe':
      return <AppWindow className={`${sizeClasses} text-blue-400 ${className}`} />;
    case 'msi':
      return <Package className={`${sizeClasses} text-sky-400 ${className}`} />;
    case 'bat':
    case 'cmd':
      return <Terminal className={`${sizeClasses} text-yellow-400 ${className}`} />;
    case 'ps1':
      return <Terminal className={`${sizeClasses} text-cyan-400 ${className}`} />;
    case 'sh':
    case 'bash':
    case 'zsh':
      return <Terminal className={`${sizeClasses} text-teal-400 ${className}`} />;

    // Documents & Office
    case 'pdf':
      return <FileText className={`${sizeClasses} text-rose-500 ${className}`} />;
    case 'docx':
    case 'doc':
    case 'rtf':
    case 'odt':
      return <FileText className={`${sizeClasses} text-blue-500 ${className}`} />;
    case 'xlsx':
    case 'xls':
    case 'csv':
    case 'ods':
      return <FileSpreadsheet className={`${sizeClasses} text-emerald-500 ${className}`} />;
    case 'pptx':
    case 'ppt':
    case 'ppsx':
    case 'odp':
      return <Presentation className={`${sizeClasses} text-orange-500 ${className}`} />;
    case 'txt':
    case 'log':
      return <FileText className={`${sizeClasses} text-slate-300 ${className}`} />;

    // Programming & Code
    case 'py':
      return <FileCode className={`${sizeClasses} text-yellow-500 ${className}`} />;
    case 'js':
    case 'jsx':
    case 'mjs':
      return <FileCode className={`${sizeClasses} text-amber-400 ${className}`} />;
    case 'ts':
    case 'tsx':
      return <FileCode className={`${sizeClasses} text-blue-400 ${className}`} />;
    case 'html':
    case 'htm':
      return <FileCode className={`${sizeClasses} text-orange-500 ${className}`} />;
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return <FileCode className={`${sizeClasses} text-cyan-400 ${className}`} />;
    case 'json':
    case 'xml':
    case 'yaml':
    case 'yml':
      return <FileCode className={`${sizeClasses} text-lime-400 ${className}`} />;
    case 'sql':
    case 'db':
    case 'sqlite':
      return <Database className={`${sizeClasses} text-indigo-400 ${className}`} />;
    case 'java':
    case 'c':
    case 'cpp':
    case 'cs':
    case 'go':
    case 'rs':
    case 'php':
    case 'rb':
    case 'lua':
      return <FileCode className={`${sizeClasses} text-purple-400 ${className}`} />;

    // Media: Images
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
    case 'gif':
    case 'svg':
    case 'ico':
    case 'bmp':
    case 'avif':
    case 'tiff':
      return <FileImage className={`${sizeClasses} text-pink-400 ${className}`} />;

    // Media: Video
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov':
    case 'webm':
    case 'flv':
    case 'wmv':
      return <FileVideo className={`${sizeClasses} text-purple-400 ${className}`} />;

    // Media: Audio
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
    case 'aac':
    case 'm4a':
    case 'wma':
      return <FileAudio className={`${sizeClasses} text-indigo-400 ${className}`} />;

    // Config / System
    case 'ini':
    case 'env':
    case 'conf':
    case 'cfg':
      return <FileCog className={`${sizeClasses} text-amber-300 ${className}`} />;

    default:
      return <FileQuestion className={`${sizeClasses} text-amber-400 ${className}`} />;
  }
};
