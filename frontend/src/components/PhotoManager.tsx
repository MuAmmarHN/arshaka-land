import React, { useState, useCallback } from 'react';
import {
  TrashIcon,
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { uploadAPI, kegiatanPhotosAPI, resolveImageUrl } from '../services/api';
import { useToast } from './Toast';
import OptimizedImage from './OptimizedImage';

interface Photo {
  id?: number;
  image_url: string;
  caption: string;
  sort_order: number;
  isNew?: boolean;
}

interface PhotoManagerProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  maxPhotos?: number;
  kegiatanId?: number;
  onRefreshPhotos?: () => void;
}

const PhotoManager: React.FC<PhotoManagerProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 10,
  kegiatanId,
  onRefreshPhotos
}) => {
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [refreshTimestamp, setRefreshTimestamp] = useState<number>(Date.now());
  const { success, error } = useToast();

  // Debug log untuk melihat photos prop (only log when photos change)
  React.useEffect(() => {
    console.log('PhotoManager photos changed:', photos);
  }, [photos]);

  // Debug log untuk refresh timestamp
  React.useEffect(() => {
    console.log('PhotoManager refresh timestamp changed:', refreshTimestamp);
  }, [refreshTimestamp]);

  const handleFileUpload = useCallback(async (files: FileList) => {
    console.log('handleFileUpload called with:', files.length, 'files'); // Debug log

    if (photos.length + files.length > maxPhotos) {
      error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);
    const newPhotos: Photo[] = [];
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Uploading file:', file.name, file.type); // Debug log

        try {
          const uploadedUrl = await uploadAPI.single(file);
          console.log('Upload successful:', uploadedUrl); // Debug log

          newPhotos.push({
            image_url: uploadedUrl, // Store relative URL, will be resolved by OptimizedImage
            caption: file.name.replace(/\.[^/.]+$/, ''), // Use filename as default caption
            sort_order: photos.length + successCount,
            isNew: true,
          });
          successCount++;
          console.log('Added photo to array:', { image_url: uploadedUrl, caption: file.name.replace(/\.[^/.]+$/, '') });
        } catch (fileError) {
          console.error('Failed to upload file:', file.name, fileError);
          errorCount++;
        }
      }

      if (newPhotos.length > 0) {
        const updatedPhotos = [...photos, ...newPhotos];
        console.log('Updating photos state:', updatedPhotos); // Debug log
        onPhotosChange(updatedPhotos);
        success(`${successCount} photo(s) uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
      } else {
        error('Failed to upload any photos');
      }
    } catch (err) {
      console.error('Upload error:', err);
      error('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  }, [photos, onPhotosChange, maxPhotos, success, error]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    console.log('Files dropped:', files.length); // Debug log

    if (files && files.length > 0) {
      // Convert FileList to Array and filter for images only
      const imageFiles = Array.from(files).filter(file =>
        file.type.startsWith('image/')
      );

      console.log('Image files:', imageFiles.length); // Debug log

      if (imageFiles.length > 0) {
        // Convert array to FileList-like object
        const fileList = Object.assign(imageFiles, {
          item: (index: number) => imageFiles[index] || null
        }) as unknown as FileList;

        handleFileUpload(fileList);
      } else {
        error('Please drop only image files');
      }
    }
  }, [handleFileUpload, error]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('Files selected:', files?.length); // Debug log
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    e.target.value = ''; // Reset input
  }, [handleFileUpload]);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const items = Array.from(photos);
    [items[index - 1], items[index]] = [items[index], items[index - 1]];

    // Update sort orders
    const updatedPhotos = items.map((photo, i) => ({
      ...photo,
      sort_order: i,
    }));

    onPhotosChange(updatedPhotos);
  };

  const handleMoveDown = (index: number) => {
    if (index === photos.length - 1) return;

    const items = Array.from(photos);
    [items[index], items[index + 1]] = [items[index + 1], items[index]];

    // Update sort orders
    const updatedPhotos = items.map((photo, i) => ({
      ...photo,
      sort_order: i,
    }));

    onPhotosChange(updatedPhotos);
  };

  const handleDeletePhoto = async (index: number) => {
    const photoToDelete = photos[index];

    const confirmDelete = window.confirm('Are you sure you want to delete this photo?');
    if (!confirmDelete) return;

    // If photo has ID, delete from database
    if (photoToDelete.id && kegiatanId) {
      try {
        await kegiatanPhotosAPI.delete(photoToDelete.id);
        success('Photo deleted from database');
      } catch (err) {
        console.error('Error deleting photo from database:', err);
        error('Failed to delete photo from database');
        return; // Don't remove from UI if database delete failed
      }
    }

    // Remove from local state
    const updatedPhotos = photos.filter((_, i) => i !== index);
    // Update sort orders
    const reorderedPhotos = updatedPhotos.map((photo, i) => ({
      ...photo,
      sort_order: i,
    }));
    onPhotosChange(reorderedPhotos);

    success(`Photo deleted successfully`);
  };

  const handleToggleSelection = (index: number) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPhotos(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map((_, index) => index)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPhotos.size === 0) {
      error('No photos selected');
      return;
    }

    const selectedIndices = Array.from(selectedPhotos).sort((a, b) => b - a);

    const confirmDelete = window.confirm(`Delete ${selectedPhotos.size} selected photo(s)?`);
    if (!confirmDelete) return;

    let updatedPhotos = [...photos];
    let deletedCount = 0;
    let failedCount = 0;

    // Delete from database first (for photos with IDs)
    for (const index of selectedIndices) {
      const photoToDelete = photos[index];
      if (photoToDelete.id && kegiatanId) {
        try {
          await kegiatanPhotosAPI.delete(photoToDelete.id);
          deletedCount++;
        } catch (err) {
          console.error('Error deleting photo from database:', err);
          failedCount++;
        }
      } else {
        deletedCount++; // Count new photos (no ID) as deleted
      }
    }

    // Remove from local state (delete from highest index to lowest to avoid index shifting)
    selectedIndices.forEach(index => {
      updatedPhotos.splice(index, 1);
    });

    // Update sort orders
    const reorderedPhotos = updatedPhotos.map((photo, i) => ({
      ...photo,
      sort_order: i,
    }));

    onPhotosChange(reorderedPhotos);
    setSelectedPhotos(new Set());
    setIsSelectionMode(false);

    if (failedCount > 0) {
      error(`${deletedCount} photo(s) deleted, ${failedCount} failed`);
    } else {
      success(`${deletedCount} photo(s) deleted successfully`);
    }
  };

  const handleClearSelection = () => {
    setSelectedPhotos(new Set());
    setIsSelectionMode(false);
  };

  const handleEditCaption = (photo: Photo) => {
    console.log('Editing photo:', photo); // Debug log
    setEditingPhoto(photo);
    setEditCaption(photo.caption || '');
  };

  const handleSaveCaption = () => {
    if (editingPhoto) {
      console.log('Saving caption:', editCaption, 'for photo:', editingPhoto); // Debug log
      const updatedPhotos = photos.map(photo => {
        const isMatch = photo.id === editingPhoto.id ||
          (photo.image_url === editingPhoto.image_url && photo.sort_order === editingPhoto.sort_order);
        console.log('Photo match check:', photo, 'matches:', isMatch); // Debug log
        return isMatch ? { ...photo, caption: editCaption } : photo;
      });
      console.log('Updated photos:', updatedPhotos); // Debug log
      onPhotosChange(updatedPhotos);
      setEditingPhoto(null);
      setEditCaption('');
      success('Caption updated successfully');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Photo Gallery ({photos.length}/{maxPhotos})
          {selectedPhotos.size > 0 && (
            <span className="ml-2 text-sm text-blue-600">
              ({selectedPhotos.size} selected)
            </span>
          )}
        </h3>

        <div className="flex items-center space-x-2">
          {/* Refresh Photos Button */}
          {kegiatanId && onRefreshPhotos && (
            <button
              type="button"
              onClick={() => {
                setRefreshTimestamp(Date.now());
                onRefreshPhotos();
              }}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
              title="Refresh photos from database"
            >
              🔄 Refresh
            </button>
          )}

          {photos.length > 0 && !isSelectionMode && (
            <button
              type="button"
              onClick={() => setIsSelectionMode(true)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Select Photos
            </button>
          )}

          {isSelectionMode && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
              >
                {selectedPhotos.size === photos.length ? 'Deselect All' : 'Select All'}
              </button>

              {selectedPhotos.size > 0 && (
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Delete Selected
                </button>
              )}

              <button
                type="button"
                onClick={handleClearSelection}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          isDragOver
            ? 'border-maroon bg-maroon/5'
            : 'border-gray-300 hover:border-maroon'
        }`}
        onDrop={(e) => {
          handleDrop(e);
          setIsDragOver(false);
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <CloudArrowUpIcon className={`mx-auto h-12 w-12 mb-4 transition-colors ${
          isDragOver ? 'text-maroon' : 'text-gray-400'
        }`} />
        <div className="space-y-2">
          <p className={`text-lg font-medium transition-colors ${
            isDragOver ? 'text-maroon' : 'text-gray-900'
          }`}>
            {isDragOver ? 'Drop photos here' : 'Upload multiple photos'}
          </p>
          <p className="text-sm text-gray-500">
            {isDragOver ? 'Release to upload' : 'Drag and drop or click to select'}
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          disabled={uploading || photos.length >= maxPhotos}
          className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maroon file:text-white hover:file:bg-red-800 file:cursor-pointer cursor-pointer"
        />
        {uploading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon"></div>
            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id ? `photo-${photo.id}` : `new-photo-${photo.image_url}-${index}`}
              className={`relative group bg-white rounded-lg border overflow-hidden transition-all ${
                isSelectionMode
                  ? selectedPhotos.has(index)
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                  : 'border-gray-200 hover:shadow-md'
              }`}
              onClick={isSelectionMode ? () => handleToggleSelection(index) : undefined}
              style={{ cursor: isSelectionMode ? 'pointer' : 'default' }}
            >
              {/* Selection Checkbox */}
              {isSelectionMode && (
                <div className="absolute top-2 left-2 z-20">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedPhotos.has(index)
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}>
                    {selectedPhotos.has(index) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              )}



              {/* Move Up/Down Buttons */}
              {!isSelectionMode && (
                <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp(index);
                    }}
                    disabled={index === 0}
                    className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUpIcon className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown(index);
                    }}
                    disabled={index === photos.length - 1}
                    className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDownIcon className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Photo */}
              <div className="aspect-video">
                <OptimizedImage
                  src={photo.image_url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-full h-full"
                  fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3EError%3C/text%3E%3C/svg%3E"
                  loading="lazy"
                  forceRefresh={!photo.isNew}
                />
              </div>

              {/* Actions */}
              {!isSelectionMode && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleEditCaption(photo);
                    }}
                    className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    title="Edit caption"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeletePhoto(index);
                    }}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Delete photo"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Caption */}
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">
                  {photo.caption || `Photo ${index + 1}`}
                </p>
              </div>

              {/* Sort Order Badge */}
              <div className="absolute bottom-2 left-2">
                <span className="inline-block px-2 py-1 bg-maroon text-white text-xs rounded-full">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Caption Modal */}
      {editingPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditingPhoto(null)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Edit Photo Caption</h3>
            <div className="mb-4">
              <OptimizedImage
                src={editingPhoto.image_url}
                alt="Preview"
                className="w-full h-32 rounded-lg mb-3"
                fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='128'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3EPreview%3C/text%3E%3C/svg%3E"
                loading="eager"
              />
              <textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Enter photo caption..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCaption}
                className="px-6 py-2 text-white bg-gradient-to-r from-maroon-700 to-maroon-800 rounded-lg hover:from-maroon-800 hover:to-maroon-700 transition-all duration-300 shadow-maroon-sm hover:shadow-maroon-md hover:-translate-y-0.5"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoManager;
