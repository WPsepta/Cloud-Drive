export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(date: Date = new Date()): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${d} ${m} ${y}, ${hours}.${minutes}`;
}

export function getFileCategory(filename: string): 'image' | 'document' | 'code' | 'archive' | 'media' | 'other' {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) {
    return 'image';
  }
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'csv', 'xlsx', 'xls', 'pptx'].includes(ext)) {
    return 'document';
  }
  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'py', 'bat', 'ps1', 'sh', 'sql', 'cpp', 'java', 'php'].includes(ext)) {
    return 'code';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'iso'].includes(ext)) {
    return 'archive';
  }
  if (['mp3', 'wav', 'ogg', 'mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
    return 'media';
  }
  return 'other';
}

export function getFileTypeBadgeColor(ext: string): { bg: string; text: string; border: string } {
  const cleanExt = ext.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(cleanExt)) {
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
  }
  if (['bat', 'ps1', 'sh', 'cmd'].includes(cleanExt)) {
    return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
  }
  if (['ts', 'tsx', 'js', 'jsx', 'json'].includes(cleanExt)) {
    return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
  }
  if (['zip', 'rar', '7z'].includes(cleanExt)) {
    return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
  }
  if (['pdf', 'doc', 'docx'].includes(cleanExt)) {
    return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
  }
  return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' };
}
