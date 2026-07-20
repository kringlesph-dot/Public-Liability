import React, { useRef, useState } from 'react';
import { FileAttachment } from '../types';
import { Upload, FileText, Image as ImageIcon, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface UploadStepProps {
  tradeLicense: FileAttachment | null;
  photos: FileAttachment[];
  onUploadTradeLicense: (file: FileAttachment | null) => void;
  onUploadPhotos: (files: FileAttachment[]) => void;
  errors: Record<string, string>;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  tradeLicense,
  photos,
  onUploadTradeLicense,
  onUploadPhotos,
  errors,
}) => {
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingLicense, setIsDraggingLicense] = useState(false);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'photos') => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files), type);
  };

  const processFiles = (files: File[], type: 'license' | 'photos') => {
    if (type === 'license') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUploadTradeLicense({
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: event.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      const processedPromises = files.map((file) => {
        return new Promise<FileAttachment>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: event.target?.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(processedPromises).then((newPhotos) => {
        onUploadPhotos([...photos, ...newPhotos]);
      });
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, type: 'license' | 'photos') => {
    e.preventDefault();
    if (type === 'license') setIsDraggingLicense(true);
    else setIsDraggingPhotos(true);
  };

  const handleDragLeave = (type: 'license' | 'photos') => {
    if (type === 'license') setIsDraggingLicense(false);
    else setIsDraggingPhotos(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'license' | 'photos') => {
    e.preventDefault();
    if (type === 'license') {
      setIsDraggingLicense(false);
      const files = Array.from(e.dataTransfer.files) as File[];
      processFiles(files, 'license');
    } else {
      setIsDraggingPhotos(false);
      const files = Array.from(e.dataTransfer.files) as File[];
      processFiles(files, 'photos');
    }
  };

  const removePhoto = (idxToRemove: number) => {
    const updated = photos.filter((_, idx) => idx !== idxToRemove);
    onUploadPhotos(updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <Upload className="w-5 h-5 text-brand-green" />
          Document & Asset Uploads
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Attach a copy of your valid Trade License and site/location photos to expedite insurance underwriter validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trade License Upload */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Corporate Trade License <span className="text-rose-500 font-bold">*</span>
            </label>
            {tradeLicense && (
              <span className="text-[11px] font-semibold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            )}
          </div>

          <div
            onDragOver={(e) => handleDragOver(e, 'license')}
            onDragLeave={() => handleDragLeave('license')}
            onDrop={(e) => handleDrop(e, 'license')}
            onClick={() => licenseInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px]
              \${
                isDraggingLicense
                  ? 'border-brand-green bg-brand-green-light/40 scale-[0.98]'
                  : tradeLicense
                  ? 'border-green-300 bg-green-50/10 hover:border-green-400'
                  : errors.tradeLicense
                  ? 'border-rose-300 bg-rose-50/10 hover:border-rose-400'
                  : 'border-slate-200 hover:border-brand-green hover:bg-slate-50/50'
              }`}
          >
            <input
              type="file"
              ref={licenseInputRef}
              onChange={(e) => handleFileChange(e, 'license')}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            
            {tradeLicense ? (
              <div className="space-y-2 max-w-full">
                <div className="p-3 bg-green-100 text-green-700 rounded-lg inline-block">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="px-2">
                  <p className="text-sm font-medium text-slate-800 truncate max-w-[200px] mx-auto">
                    {tradeLicense.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(tradeLicense.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUploadTradeLicense(null);
                  }}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-100 rounded-md hover:bg-rose-100 transition-all mt-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-slate-100 text-slate-500 rounded-lg inline-block hover:scale-105 transition-all">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Drag & drop Trade License</p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse local files</p>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Supports PDF, PNG, JPG (Max 10MB)</p>
              </div>
            )}
          </div>
          {errors.tradeLicense && (
            <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {errors.tradeLicense}
            </p>
          )}
        </div>

        {/* Photos Upload */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              Site / Location Photos <span className="text-slate-400 font-normal">(Optional but recommended)</span>
            </label>
            {photos.length > 0 && (
              <span className="text-[11px] font-bold text-brand-green bg-brand-green-light px-2 py-0.5 rounded-full border border-brand-green-border">
                {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
              </span>
            )}
          </div>

          <div
            onDragOver={(e) => handleDragOver(e, 'photos')}
            onDragLeave={() => handleDragLeave('photos')}
            onDrop={(e) => handleDrop(e, 'photos')}
            onClick={() => photosInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px]
              \s${
                isDraggingPhotos
                  ? 'border-brand-green bg-brand-green-light/40 scale-[0.98]'
                  : 'border-slate-200 hover:border-brand-green hover:bg-slate-50/50'
              }`}
          >
            <input
              type="file"
              ref={photosInputRef}
              onChange={(e) => handleFileChange(e, 'photos')}
              accept=".jpg,.jpeg,.png"
              multiple
              className="hidden"
            />
            
            <div className="space-y-2">
              <div className="p-3 bg-slate-100 text-slate-500 rounded-lg inline-block hover:scale-105 transition-all">
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Drag & drop Location Photos</p>
                <p className="text-xs text-slate-400 mt-1">or click to browse multiple files</p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Supports JPG, PNG (Upload multiple)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Render photo gallery */}
      {photos.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Uploaded Photos Gallery
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="group relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-sm transition-all hover:shadow-md aspect-square"
              >
                {photo.dataUrl ? (
                  <img
                    src={photo.dataUrl}
                    alt={photo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-slate-400">
                    <ImageIcon className="w-8 h-8 opacity-60 mb-1" />
                    <span className="text-[10px] text-center truncate max-w-full font-medium">
                      {photo.name}
                    </span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                  <div className="text-[10px] text-white truncate font-medium">
                    {photo.name}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-200 font-semibold bg-slate-800/80 px-1.5 py-0.5 rounded">
                      {formatFileSize(photo.size)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(idx);
                      }}
                      className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md transition-all scale-95 hover:scale-100 shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
