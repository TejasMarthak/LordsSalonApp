import React, { useState, useRef } from 'react';
import axios from 'axios';
import config from '../../config';

export default function PhotoUpload({ onUploadComplete, onUploadError, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        onUploadError?.('Only image files are allowed');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        onUploadError?.('File size must be less than 10MB');
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    // Create previews
    const newPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    if (!multiple) {
      setPreviews([newPreviews[0]]);
    } else {
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const uploadToCloudinary = async () => {
    if (previews.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < previews.length; i++) {
        const { file } = previews[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'upload_preset',
          process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'lords_salon'
        );

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                ((i + progressEvent.loaded / progressEvent.total) / previews.length) * 100
              );
              setUploadProgress(progress);
            },
          }
        );

        uploadedUrls.push(response.data.secure_url);
      }

      onUploadComplete?.(multiple ? uploadedUrls : uploadedUrls[0]);
      setPreviews([]);
      fileInputRef.current.value = '';
    } catch (error) {
      onUploadError?.(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removePreview = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* File Input */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full py-3 border-2 border-dashed border-pink-400 rounded-xl hover:border-pink-600 hover:bg-pink-50 transition-all disabled:opacity-50 text-pink-600 font-semibold"
        >
          {uploading ? '📤 Uploading...' : '📸 Choose Photos from Device'}
        </button>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previews.map((item, index) => (
              <div key={index} className="relative group">
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-full h-24 object-cover rounded-lg border-2 border-pink-200"
                />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {uploading && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-orange-400 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={uploadToCloudinary}
              disabled={uploading}
              className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {uploading ? '⏳ Uploading...' : '📤 Upload Photos'}
            </button>

            <button
              type="button"
              onClick={clearAll}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              ✕ Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
