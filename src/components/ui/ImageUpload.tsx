import React, { useRef, useState } from 'react';
import { ImagePlus, RefreshCw, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getOptimizedImageUrl } from '@/utils/imageOptimizer';

interface ImageUploadProps {
  label?: string;
  error?: string;
  previewUrl?: string | null;
  onChange: (file: File | null) => void;
  hint?: string;
  className?: string;
}

export function ImageUpload({ 
  label, 
  error, 
  previewUrl, 
  onChange,
  hint = 'Recommended: 800 × 800 px (1:1)',
  className = '',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Selected file is not a valid image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB.');
      return;
    }
    onChange(file);
    toast.success('Image selected');
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange(null);
    toast.success('Image removed');
  };

  const handleTriggerReplace = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
      />
      
      {previewUrl ? (
        <div 
          className="relative w-full max-w-[320px] mx-auto aspect-square rounded-2xl border-2 border-purple-500/80 ring-2 ring-purple-100 overflow-hidden group bg-gray-900 shadow-md transition-all duration-300"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* Ambient background glow for transparent/non-square images */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30 pointer-events-none" 
            style={{ backgroundImage: `url(${previewUrl})` }}
          />
          <div className="absolute inset-0 bg-gray-950/40 pointer-events-none" />

          {/* Main preview image */}
          <img 
            src={getOptimizedImageUrl(previewUrl, 600)} 
            alt="Preview" 
            loading="lazy" 
            decoding="async" 
            className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />

          {/* Top-right: Circular Remove (X) button */}
          <button
            type="button"
            title="Remove image"
            aria-label="Remove image"
            onClick={handleRemove}
            className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all hover:scale-110"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          {/* Bottom center: Replace button */}
          <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center px-2">
            <button
              type="button"
              title="Replace / Update this image"
              onClick={handleTriggerReplace}
              className="bg-white/95 hover:bg-white text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-1.5 border border-white/60"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              Replace
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`relative w-full max-w-[320px] mx-auto aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer p-6 transition-all duration-200 ${
            dragActive 
              ? 'border-[#5022C3] bg-purple-50/60 scale-[0.99]' 
              : error 
              ? 'border-red-400 bg-red-50/40' 
              : 'border-gray-300 bg-gray-50/60 hover:bg-purple-50/30 hover:border-purple-300 hover:shadow-sm'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-[#5022C3] mb-3 group-hover:scale-110 transition-transform">
            <ImagePlus className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-gray-800 mb-1">
            Drag & drop image here
          </p>
          <p className="text-xs text-gray-500 mb-2">
            or click to browse files
          </p>
          {hint && (
            <span className="inline-block text-[11px] font-semibold text-[#5022C3] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 mb-3">
              {hint}
            </span>
          )}
          <div className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm hover:border-[#5022C3] hover:text-[#5022C3] transition-colors flex items-center gap-1.5">
            <ImagePlus className="w-3.5 h-3.5 text-[#5022C3]" />
            Add Image
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600 flex items-center justify-center gap-1.5 bg-red-50/80 p-2 rounded-lg border border-red-200 max-w-[320px] mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
