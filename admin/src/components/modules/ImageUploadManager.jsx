import React, { useState } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { UploadIcon, DeleteIcon } from '../../utils/Icons';

export default function ImageUploadManager({ onImageSelect, location = 'general' }) {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    try {
      setError('');
      
      // Validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        setError('Please upload JPEG, PNG, or WebP image');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setUploading(true);

      // Prepare FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('location', location);

      // Upload
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${adminConfig.api.baseUrl}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Set selected image and call callback
      setSelectedImage({
        imageId: response.data.imageId,
        filename: response.data.filename,
        originalName: file.name,
        url: response.data.url,
      });

      if (onImageSelect) {
        onImageSelect({
          imageId: response.data.imageId,
          filename: response.data.filename,
          url: response.data.url,
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${adminConfig.api.baseUrl}/api/upload/${selectedImage.imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedImage(null);
      if (onImageSelect) {
        onImageSelect(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete image');
    }
  };

  return (
    <div className="space-y-3">
      {/* Drag Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
        style={{
          borderColor: dragActive ? adminConfig.colors.accent : adminConfig.colors.border,
          backgroundColor: dragActive ? adminConfig.colors.lightBg : 'transparent',
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-2">
          <UploadIcon />
          <div>
            <p className="font-inter font-semibold" style={{ color: adminConfig.colors.primary }}>
              {uploading ? 'Uploading...' : 'Drag and drop image here'}
            </p>
            <p className="font-inter text-sm" style={{ color: adminConfig.colors.textLight }}>
              or click to browse (JPEG, PNG, WebP max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFEBEE' }}>
          <p className="font-inter text-sm" style={{ color: '#C62828' }}>
            {error}
          </p>
        </div>
      )}

      {/* Selected Image Preview */}
      {selectedImage && (
        <div>
          <div className="relative rounded-lg overflow-hidden bg-gray-100 border" style={{ borderColor: adminConfig.colors.border }}>
            <img src={selectedImage.url} alt="Uploaded" className="w-full h-auto" />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 rounded-lg bg-white hover:bg-red-50 transition-colors"
            >
              <DeleteIcon />
            </button>
          </div>
          <p className="font-inter text-xs mt-2" style={{ color: adminConfig.colors.textLight }}>
            {selectedImage.originalName}
          </p>
        </div>
      )}
    </div>
  );
}
