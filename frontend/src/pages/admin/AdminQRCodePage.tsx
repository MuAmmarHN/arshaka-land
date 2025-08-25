import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import OptimizedImage from '../../components/OptimizedImage';
import { useToast } from '../../components/Toast';
import { qrcodeAPI, uploadAPI, QRCode } from '../../services/api';

const AdminQRCodePage: React.FC = () => {
  const [qrcodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQRCode, setEditingQRCode] = useState<QRCode | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    keterangan: '',
    enable: true,
  });
  const [uploading, setUploading] = useState(false);
  const { ToastContainer, success, error } = useToast();

  useEffect(() => {
    fetchQRCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQRCodes = async () => {
    try {
      const data = await qrcodeAPI.getAll();
      setQRCodes(data);
    } catch (err) {
      error('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: QRCode) => {
    if (item) {
      setEditingQRCode(item);
      setFormData({
        image_url: item.image_url,
        keterangan: item.keterangan || '',
        enable: item.enable,
      });
    } else {
      setEditingQRCode(null);
      setFormData({
        image_url: '',
        keterangan: '',
        enable: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQRCode(null);
    setFormData({
      image_url: '',
      keterangan: '',
      enable: true,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      error('Please upload a QR code image');
      return;
    }

    try {
      if (editingQRCode) {
        await qrcodeAPI.update(editingQRCode.id, formData);
        success('QR Code updated successfully');
      } else {
        await qrcodeAPI.create(formData);
        success('QR Code created successfully');
      }

      handleCloseModal();
      fetchQRCodes();
    } catch (err) {
      error('Failed to save QR code');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await qrcodeAPI.toggle(id);
      success('QR Code status toggled successfully');
      fetchQRCodes();
    } catch (err) {
      error('Failed to toggle QR code status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    try {
      await qrcodeAPI.delete(id);
      success('QR Code deleted successfully');
      fetchQRCodes();
    } catch (err) {
      error('Failed to delete QR code');
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
            <h1 className="text-2xl font-bold text-gray-800">QR Code Management</h1>
            <p className="text-gray-600">Manage QR codes for the website</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-maroon-700 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-maroon-md hover:shadow-maroon-lg hover:-translate-y-0.5"
          >
            <span className="mr-2 text-lg">+</span>
            Add QR Code
          </button>
        </div>

        {/* QR Code Grid */}
        <div className="bg-white rounded-xl shadow-maroon-md border border-maroon-100 overflow-hidden">
          {qrcodes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                <span className="text-2xl text-amber-600">📱</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
              <p className="text-gray-500 mb-4">Create QR codes for easy access to your content</p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white text-sm font-medium rounded-lg hover:from-maroon-800 hover:to-maroon-700 transition-all duration-300"
              >
                <span className="mr-2">+</span>
                Add QR Code
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-maroon-100">
                <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      QR Code
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-maroon-100">
                  {qrcodes.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gradient-to-r hover:from-amber-25 hover:to-amber-50 transition-all duration-200">
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="flex justify-center">
                          <div className="relative">
                            <OptimizedImage
                              src={item.image_url}
                              alt={`QR Code ${item.id}`}
                              className="h-16 w-16 rounded-lg shadow-maroon-sm border border-amber-100"
                              fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='10'%3EQR%3C/text%3E%3C/svg%3E"
                              loading="eager"
                            />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {item.keterangan || 'No description'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            QR Code #{index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          item.enable
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            item.enable ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          {item.enable ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long' })}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleToggle(item.id)}
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                              item.enable
                                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 hover:text-red-800'
                                : 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 hover:text-green-800'
                            }`}
                            title={item.enable ? 'Disable QR Code' : 'Enable QR Code'}
                          >
                            {item.enable ? (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {item.enable ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 text-xs font-medium rounded-lg hover:from-amber-100 hover:to-amber-200 hover:text-amber-800 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Edit QR Code"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-xs font-medium rounded-lg hover:from-red-100 hover:to-red-200 hover:text-red-800 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Delete QR Code"
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

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                QR Code Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Only enabled QR codes will be displayed on the public website. You can toggle the status of each QR code using the Enable/Disable button.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingQRCode ? 'Edit QR Code' : 'Add QR Code'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="qrcode-image" className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Image
            </label>
            <input
              id="qrcode-image"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maroon file:text-white hover:file:bg-red-800"
              disabled={uploading}
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading...</p>
            )}
            {formData.image_url && (
              <div className="mt-2">
                <OptimizedImage
                  src={formData.image_url}
                  alt="Preview"
                  className="h-32 w-32 rounded-lg"
                  fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3EPreview%3C/text%3E%3C/svg%3E"
                  loading="eager"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="qrcode-keterangan" className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              id="qrcode-keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
              placeholder="Masukkan keterangan untuk QR Code ini..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Keterangan akan ditampilkan di tabel admin untuk memudahkan identifikasi QR Code
            </p>
          </div>

          <div className="flex items-center">
            <input
              id="qrcode-enable"
              type="checkbox"
              name="enable"
              checked={formData.enable}
              onChange={handleInputChange}
              className="h-4 w-4 text-maroon focus:ring-maroon border-gray-300 rounded"
            />
            <label htmlFor="qrcode-enable" className="ml-2 block text-sm text-gray-900">
              Enable this QR code (will be visible on website)
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !formData.image_url}
              className="px-4 py-2 text-sm font-medium text-white bg-maroon rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingQRCode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminQRCodePage;
