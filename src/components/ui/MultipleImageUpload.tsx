import React, { useRef, useState } from 'react';
import { ImagePlus, Trash2, Star, RefreshCw, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MultipleImageUploadProps {
  label?: string;
  error?: string;
  files: File[];
  previewUrls: string[];
  onChange: (files: File[], urls: string[]) => void;
  maxFiles?: number;
}

export function MultipleImageUpload({
  label,
  error,
  files,
  previewUrls,
  onChange,
  maxFiles = 5,
}: MultipleImageUploadProps) {
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Helper to reconstruct array of { url, file }
  const getItems = () => {
    let fileIdx = 0;
    return previewUrls.map((url) => {
      if (url.startsWith('blob:')) {
        const file = files[fileIdx] || null;
        fileIdx++;
        return { url, file };
      }
      return { url, file: null };
    });
  };

  const emitChange = (items: Array<{ url: string; file: File | null }>) => {
    const newUrls = items.map((item) => item.url);
    const newFiles = items.map((item) => item.file).filter((f): f is File => f !== null);
    onChange(newFiles, newUrls);
  };

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
    if (e.dataTransfer.files) {
      handleAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleAddFiles = (newFiles: File[]) => {
    if (previewUrls.length + newFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 10MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const currentItems = getItems();
    const newItems = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    emitChange([...currentItems, ...newItems]);
    if (addFileInputRef.current) addFileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    const currentItems = getItems();
    const updatedItems = currentItems.filter((_, idx) => idx !== index);
    emitChange(updatedItems);
    toast.success('Image removed');
  };

  const handleMakeMain = (index: number) => {
    if (index === 0) return;
    const currentItems = getItems();
    const targetItem = currentItems[index];
    const remainingItems = currentItems.filter((_, idx) => idx !== index);
    const updatedItems = [targetItem, ...remainingItems];
    emitChange(updatedItems);
    toast.success('Set as main image');
  };

  const triggerReplace = (index: number) => {
    setReplacingIndex(index);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
      replaceFileInputRef.current.click();
    }
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || replacingIndex === null) return;
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Selected file is not an image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB.');
      return;
    }

    const currentItems = getItems();
    if (replacingIndex >= 0 && replacingIndex < currentItems.length) {
      currentItems[replacingIndex] = {
        url: URL.createObjectURL(file),
        file,
      };
      emitChange(currentItems);
      toast.success('Image updated');
    }
    setReplacingIndex(null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide flex justify-between items-center">
          <span>{label}</span>
          <span className="text-gray-400 font-normal normal-case">
            {previewUrls.length} / {maxFiles}
          </span>
        </label>
      )}

      {/* Hidden file input for replacement */}
      <input
        ref={replaceFileInputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleReplaceFileChange}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-3">
        {previewUrls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className={`relative aspect-video sm:aspect-square rounded-2xl border-2 overflow-hidden group bg-gray-900 shadow-sm transition-all duration-300 ${
              index === 0 ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img src={url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />

            {/* Main Badge */}
            {index === 0 ? (
              <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-current" />
                Main
              </div>
            ) : (
              <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                Slide {index + 1}
              </div>
            )}

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-between p-3 z-20">
              {/* Top actions */}
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  title="Delete image"
                  onClick={() => handleRemove(index)}
                  className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-xl transition-all hover:scale-105 shadow-md flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center gap-1.5 justify-center">
                {index !== 0 && (
                  <button
                    type="button"
                    title="Make this the main image"
                    onClick={() => handleMakeMain(index)}
                    className="bg-white/95 hover:bg-white text-gray-900 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all hover:scale-105 shadow-md flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Make Main
                  </button>
                )}
                <button
                  type="button"
                  title="Replace / Update this image"
                  onClick={() => triggerReplace(index)}
                  className="bg-white/95 hover:bg-white text-gray-900 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all hover:scale-105 shadow-md flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                  Replace
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Image Slot */}
        {previewUrls.length < maxFiles && (
          <div
            className={`relative aspect-video sm:aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-[#5022C3] bg-purple-50/50 scale-[0.99]'
                : error && previewUrls.length === 0
                ? 'border-red-300 bg-red-50/30'
                : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100/80 hover:border-gray-300 hover:shadow-sm'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => addFileInputRef.current?.click()}
          >
            <input
              ref={addFileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  handleAddFiles(Array.from(e.target.files));
                }
              }}
            />
            <div className="w-11 h-11 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-[#5022C3] mb-2 group-hover:scale-110 transition-transform">
              <ImagePlus className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-gray-800 px-2">Add Image</p>
            <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WebP</p>
          </div>
        )}
      </div>

      {previewUrls.length === 0 && !error && (
        <p className="text-xs text-gray-500">
          Upload up to {maxFiles} images. The first image marked as &ldquo;Main&rdquo; will be shown first.
        </p>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
