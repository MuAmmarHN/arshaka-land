import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import PhotoManager from '../../components/PhotoManager';
import OptimizedImage from '../../components/OptimizedImage';
import { useToast } from '../../components/Toast';
import { kegiatanAPI, kegiatanPhotosAPI, uploadAPI, Kegiatan } from '../../services/api';
// Icons will be imported as needed

const AdminKegiatanPage: React.FC = () => {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKegiatan, setEditingKegiatan] = useState<Kegiatan | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    cover: '',
    tanggal: '',
  });
  const [photos, setPhotos] = useState<Array<{
    id?: number;
    image_url: string;
    caption: string;
    sort_order: number;
    isNew?: boolean;
  }>>([]);
  const [uploading, setUploading] = useState(false);
  const { ToastContainer, success, error } = useToast();

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const fetchKegiatan = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await kegiatanAPI.getAll();
      setKegiatan(data);
    } catch (err) {
      error('Failed to fetch kegiatan');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [error]);

  const refreshKegiatan = useCallback(() => {
    fetchKegiatan(false); // Refresh without showing loading
  }, [fetchKegiatan]);

  const handleOpenModal = async (item?: Kegiatan) => {
    if (item) {
      setEditingKegiatan(item);
      setFormData({
        judul: item.judul,
        deskripsi: item.deskripsi,
        cover: item.cover,
        tanggal: item.tanggal.split('T')[0], // Format for date input
      });

      // Load existing photos from API (fresh data)
      console.log('Loading existing photos for kegiatan:', item.id); // Debug log
      try {
        const freshKegiatanData = await kegiatanAPI.getById(item.id);
        console.log('Fresh kegiatan data:', freshKegiatanData); // Debug log

        const existingPhotos = freshKegiatanData.fotos?.map((foto, index) => ({
          id: foto.id,
          image_url: foto.image_url,
          caption: foto.caption || '',
          sort_order: foto.sort_order || index,
        })) || [];

        console.log('Processed existing photos:', existingPhotos); // Debug log
        setPhotos(existingPhotos);
      } catch (err) {
        console.error('Error loading fresh kegiatan data:', err);
        // Fallback to existing data
        const existingPhotos = item.fotos?.map((foto, index) => ({
          id: foto.id,
          image_url: foto.image_url,
          caption: foto.caption || '',
          sort_order: foto.sort_order || index,
        })) || [];
        setPhotos(existingPhotos);
      }
    } else {
      setEditingKegiatan(null);
      setFormData({
        judul: '',
        deskripsi: '',
        cover: '',
        tanggal: '',
      });
      setPhotos([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKegiatan(null);
    setFormData({
      judul: '',
      deskripsi: '',
      cover: '',
      tanggal: '',
    });
    setPhotos([]);
  };

  const handleRefreshPhotos = async () => {
    if (editingKegiatan) {
      try {
        console.log('Refreshing photos for kegiatan:', editingKegiatan.id);
        const freshData = await kegiatanAPI.getById(editingKegiatan.id);
        console.log('Fresh data received:', freshData);

        const refreshedPhotos = freshData.fotos?.map((foto, index) => ({
          id: foto.id,
          image_url: foto.image_url,
          caption: foto.caption || '',
          sort_order: foto.sort_order || index,
        })) || [];

        console.log('Refreshed photos:', refreshedPhotos);
        setPhotos(refreshedPhotos);
        success('Photos refreshed successfully');
      } catch (err) {
        console.error('Error refreshing photos:', err);
        error('Failed to refresh photos');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadAPI.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        cover: result.url,
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

    if (!formData.judul || !formData.deskripsi || !formData.cover || !formData.tanggal) {
      error('Please fill all fields');
      return;
    }

    try {
      const submitData = {
        ...formData,
        tanggal: new Date(formData.tanggal).toISOString(),
      };

      let kegiatanId: number;

      if (editingKegiatan) {
        await kegiatanAPI.update(editingKegiatan.id, submitData);
        kegiatanId = editingKegiatan.id;

        // Handle photo updates for existing kegiatan
        const existingPhotos = editingKegiatan.fotos || [];
        const newPhotoIds = photos.filter(p => p.id).map(p => p.id);

        // Delete removed photos
        for (const existingPhoto of existingPhotos) {
          if (!newPhotoIds.includes(existingPhoto.id)) {
            try {
              await kegiatanPhotosAPI.delete(existingPhoto.id);
            } catch (err) {
              console.error('Failed to delete photo:', existingPhoto.id);
            }
          }
        }

        success('Kegiatan updated successfully');
      } else {
        const createdKegiatan = await kegiatanAPI.create(submitData);
        kegiatanId = createdKegiatan.id;
        success('Kegiatan created successfully');
      }

      // Save new photos to database
      for (const photo of photos) {
        if (photo.isNew || !photo.id) {
          try {
            await kegiatanPhotosAPI.create(kegiatanId, {
              image_url: photo.image_url,
              caption: photo.caption,
              sort_order: photo.sort_order,
            });
          } catch (err) {
            console.error('Failed to save photo:', photo);
          }
        } else {
          // Update existing photo
          try {
            await kegiatanPhotosAPI.update(photo.id, {
              image_url: photo.image_url,
              caption: photo.caption,
              sort_order: photo.sort_order,
            });
          } catch (err) {
            console.error('Failed to update photo:', photo);
          }
        }
      }

      handleCloseModal();
      // Refresh kegiatan list to get updated data with photos
      refreshKegiatan();
    } catch (err) {
      console.error('Submit error:', err);
      error('Failed to save kegiatan');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this kegiatan?')) {
      return;
    }

    try {
      await kegiatanAPI.delete(id);
      success('Kegiatan deleted successfully');
      refreshKegiatan();
    } catch (err) {
      error('Failed to delete kegiatan');
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kegiatan Management</h1>
            <p className="text-gray-600">Manage activities and events</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-maroon-700 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-maroon-md hover:shadow-maroon-lg hover:-translate-y-0.5"
          >
            <span className="mr-2 text-lg">+</span>
            Add Kegiatan
          </button>
        </div>

        {/* Kegiatan Grid */}
        <div className="bg-white rounded-xl shadow-maroon-md border border-maroon-100 overflow-hidden">
          {kegiatan.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-maroon-100 to-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-maroon-600">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No kegiatan found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first activity</p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white text-sm font-medium rounded-lg hover:from-maroon-800 hover:to-maroon-700 transition-all duration-300"
              >
                <span className="mr-2">+</span>
                Add Kegiatan
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-maroon-100">
                <thead className="bg-gradient-to-r from-maroon-50 to-red-50">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-maroon-800 uppercase tracking-wider">
                      Cover
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-maroon-800 uppercase tracking-wider">
                      Judul & Info
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-maroon-800 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-maroon-800 uppercase tracking-wider">
                      Photos
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-maroon-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-maroon-100">
                  {kegiatan.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gradient-to-r hover:from-maroon-25 hover:to-red-25 transition-all duration-200">
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="relative inline-block">
                          <OptimizedImage
                            src={item.cover}
                            alt={item.judul}
                            className="h-16 w-24 rounded-lg shadow-maroon-sm border border-maroon-100"
                            fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E"
                            loading="eager"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-left">
                        <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">
                          {item.judul}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                          {item.deskripsi}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(item.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long' })}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          {(item.fotos?.length || 0) > 0 ? (
                            <div className="flex items-center">
                              <div className="flex -space-x-1 mr-2">
                                {item.fotos?.slice(0, 3).map((foto, idx) => (
                                  <OptimizedImage
                                    key={foto.id || idx}
                                    src={foto.image_url}
                                    alt={`Photo ${idx + 1}`}
                                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                    fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='10'%3EP%3C/text%3E%3C/svg%3E"
                                    loading="lazy"
                                  />
                                ))}
                                {(item.fotos?.length || 0) > 3 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-gray-600 font-medium">+{(item.fotos?.length || 0) - 3}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-sm font-medium text-maroon-600">
                                {item.fotos?.length || 0} photos
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-400">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm">No photos</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-xs font-medium rounded-lg hover:from-red-100 hover:to-red-200 hover:text-red-800 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingKegiatan ? 'Edit Kegiatan' : 'Add Kegiatan'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="kegiatan-judul" className="block text-sm font-medium text-gray-700 mb-2">
              Judul
            </label>
            <input
              id="kegiatan-judul"
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:border-maroon-700 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="kegiatan-tanggal" className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal
            </label>
            <input
              id="kegiatan-tanggal"
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:border-maroon-700 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="kegiatan-cover" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <input
              id="kegiatan-cover"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-maroon-700 file:to-maroon-800 file:text-white hover:file:from-maroon-800 hover:file:to-maroon-700 file:transition-all file:duration-300"
              disabled={uploading}
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading...</p>
            )}
            {formData.cover && (
              <div className="mt-2">
                <img
                  src={formData.cover}
                  alt="Preview"
                  className="h-32 w-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="kegiatan-deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              id="kegiatan-deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:border-maroon-700 transition-colors"
              required
            />
          </div>

          {/* Photo Gallery Manager */}
          <div className="border-t border-gray-200 pt-6">
            <PhotoManager
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={10}
              kegiatanId={editingKegiatan?.id}
              onRefreshPhotos={handleRefreshPhotos}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-maroon-700 to-maroon-800 rounded-lg hover:from-maroon-800 hover:to-maroon-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-maroon-sm hover:shadow-maroon-md hover:-translate-y-0.5"
            >
              {editingKegiatan ? 'Update Kegiatan' : 'Create Kegiatan'}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminKegiatanPage;
