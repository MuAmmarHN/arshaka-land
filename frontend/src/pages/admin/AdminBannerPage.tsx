import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import OptimizedImage from '../../components/OptimizedImage';
import { useToast } from '../../components/Toast';
import { bannerAPI, uploadAPI, Banner } from '../../services/api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const AdminBannerPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
  });
  const [uploading, setUploading] = useState(false);
  const { ToastContainer, success, error } = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = useCallback(async () => {
    try {
      const data = await bannerAPI.getAll();
      setBanners(data);
    } catch (err) {
      error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  }, [error]);

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        image_url: banner.image_url,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        image_url: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setFormData({
      image_url: '',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadAPI.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        image_url: result.url,
      }));
      success('Image uploaded successfully');
    } catch (err) {
      error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image_url) {
      error('Please upload an image');
      return;
    }

    try {
      if (editingBanner) {
        await bannerAPI.update(editingBanner.id, formData);
        success('Banner updated successfully');
      } else {
        await bannerAPI.create(formData);
        success('Banner created successfully');
      }

      handleCloseModal();
      fetchBanners();
    } catch (err) {
      error('Failed to save banner');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      await bannerAPI.delete(id);
      success('Banner deleted successfully');
      fetchBanners();
    } catch (err) {
      error('Failed to delete banner');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
            <p className="text-gray-600 mt-1">Manage website banners and carousel images</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-maroon-700 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white font-bold rounded-lg transition-all duration-300 shadow-maroon-md hover:shadow-maroon-lg hover:-translate-y-0.5"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Banner
          </button>
        </div>

        {/* Banner Grid */}
        {banners.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first banner</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-maroon-700 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First Banner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner, index) => (
              <div key={banner.id} className="bg-white rounded-xl shadow-maroon-sm border border-maroon-100 overflow-hidden hover:shadow-maroon-lg hover:-translate-y-1 transition-all duration-300 group">
                {/* Banner Image */}
                <div className="aspect-video relative">
                  <OptimizedImage
                    src={banner.image_url}
                    alt={`Banner ${banner.id}`}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.open(banner.image_url, '_blank')}
                        className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-maroon-700 hover:bg-white transition-all duration-200 shadow-lg"
                        title="View Full Size"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{index + 1}
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <p className="text-sm font-medium text-gray-700">
                            Active Banner
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Banner #{index + 1}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Created {new Date(banner.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(banner)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-sm font-medium rounded-lg hover:from-red-100 hover:to-red-200 hover:text-red-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBanner ? 'Edit Banner' : 'Add New Banner'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Banner Image
            </label>

            {!formData.image_url ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-maroon transition-colors">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">Upload banner image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <label htmlFor="banner-upload" className="sr-only">Upload banner image</label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maroon file:text-white hover:file:bg-red-800 file:cursor-pointer cursor-pointer"
                />
                {uploading && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon"></div>
                    <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <OptimizedImage
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48"
                    fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='192'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3EPreview%3C/text%3E%3C/svg%3E"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      className="opacity-0 hover:opacity-100 transition-opacity bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-800">Image uploaded successfully</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    className="text-sm text-green-700 hover:text-green-900 font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.image_url}
              className="px-6 py-2 text-sm font-medium text-white bg-maroon rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminBannerPage;
