'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
}

/**
 * Image upload component with Cloudinary integration
 */
export default function ImageUpload({
  onImageUpload,
  currentImage,
  label = 'Cover Image',
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection and upload
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPreviewUrl(data.imageUrl);
        onImageUpload(data.imageUrl);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Remove current image
   */
  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Trigger file input click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-amber-900 font-medium">{label}</Label>
      
      {previewUrl ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-amber-200">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            onClick={handleRemoveImage}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors"
        >
          <ImageIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-amber-700 mb-2">Click to upload an image</p>
          <p className="text-sm text-amber-600">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        type="button"
        onClick={handleUploadClick}
        disabled={uploading}
        variant="outline"
        className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-700 mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {previewUrl ? 'Change Image' : 'Upload Image'}
          </>
        )}
      </Button>
    </div>
  );
}