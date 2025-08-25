import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import OptimizedImage from '../../components/OptimizedImage';
import { useToast } from '../../components/Toast';
import { strukturAPI, pembinaAPI, uploadAPI, Struktur, Pembina } from '../../services/api';

const AdminStrukturPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'struktur' | 'pembina'>('struktur');
  const [struktur, setStruktur] = useState<Struktur[]>([]);
  const [pembina, setPembina] = useState<Pembina[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStruktur, setEditingStruktur] = useState<Struktur | null>(null);
  const [editingPembina, setEditingPembina] = useState<Pembina | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    prodi: '',
    angkatan: '',
    nra: '',
    foto_url: '',
  });
  const [pembinaFormData, setPembinaFormData] = useState({
    nama: '',
    jabatan: '',
    nip: '',
    foto_url: '',
  });
  const [uploading, setUploading] = useState(false);
  const { ToastContainer, success, error } = useToast();

  useEffect(() => {
    fetchStruktur();
    fetchPembina();
  }, []);

  // Debug log untuk melihat data struktur
  useEffect(() => {
    console.log('AdminStrukturPage struktur data:', struktur);
    if (struktur.length > 0) {
      console.log('First struktur item NRA:', struktur[0].nra);
    }
  }, [struktur]);

  const fetchStruktur = async () => {
    try {
      const data = await strukturAPI.getAll();
      console.log('fetchStruktur received data:', data); // Debug log
      setStruktur(data);
    } catch (err) {
      console.error('fetchStruktur error:', err); // Debug log
      error('Failed to fetch struktur');
    } finally {
      setLoading(false);
    }
  };

  const fetchPembina = async () => {
    try {
      const data = await pembinaAPI.getAll();
      setPembina(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pembina:', error);
      setPembina([]);
    }
  };

  const handleOpenModal = (item?: Struktur) => {
    if (item) {
      setEditingStruktur(item);
      setFormData({
        nama: item.nama,
        jabatan: item.jabatan,
        prodi: item.prodi,
        angkatan: item.angkatan,
        nra: item.nra || '',
        foto_url: item.foto_url,
      });
    } else {
      setEditingStruktur(null);
      setFormData({
        nama: '',
        jabatan: '',
        prodi: '',
        angkatan: '',
        nra: '',
        foto_url: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStruktur(null);
    setFormData({
      nama: '',
      jabatan: '',
      prodi: '',
      angkatan: '',
      nra: '',
      foto_url: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (editingPembina || activeTab === 'pembina') {
        setPembinaFormData(prev => ({
          ...prev,
          foto_url: result.url,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          foto_url: result.url,
        }));
      }
      success('Image uploaded successfully');
    } catch (err) {
      error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama || !formData.jabatan || !formData.prodi || !formData.angkatan || !formData.nra || !formData.foto_url) {
      error('Please fill all fields');
      return;
    }

    try {
      console.log('handleSubmit formData:', formData); // Debug log
      if (editingStruktur) {
        console.log('Updating struktur ID:', editingStruktur.id); // Debug log
        await strukturAPI.update(editingStruktur.id, formData);
        success('Struktur updated successfully');
      } else {
        console.log('Creating new struktur'); // Debug log
        await strukturAPI.create(formData);
        success('Struktur created successfully');
      }

      handleCloseModal();
      fetchStruktur();
    } catch (err) {
      console.error('handleSubmit error:', err); // Debug log
      error('Failed to save struktur');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this struktur?')) {
      return;
    }

    try {
      await strukturAPI.delete(id);
      success('Struktur deleted successfully');
      fetchStruktur();
    } catch (err) {
      error('Failed to delete struktur');
    }
  };

  // Pembina handlers
  const handleOpenPembinaModal = (item?: Pembina) => {
    if (item) {
      setEditingPembina(item);
      setPembinaFormData({
        nama: item.nama,
        jabatan: item.jabatan,
        nip: item.nip || '',
        foto_url: item.foto_url,
      });
    } else {
      setEditingPembina(null);
      setPembinaFormData({
        nama: '',
        jabatan: '',
        nip: '',
        foto_url: '',
      });
    }
    setIsModalOpen(true);
  };

  const handlePembinaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pembinaFormData.nama || !pembinaFormData.jabatan) {
      error('Please fill all required fields');
      return;
    }

    try {
      if (editingPembina) {
        await pembinaAPI.update(editingPembina.id, pembinaFormData);
        success('Pembina updated successfully');
      } else {
        await pembinaAPI.create(pembinaFormData);
        success('Pembina created successfully');
      }

      handleClosePembinaModal();
      fetchPembina();
    } catch (err: any) {
      console.error('handlePembinaSubmit error:', err);
      if (err.response?.status === 400 && err.response?.data?.includes('maksimal')) {
        error('Maksimal 2 pembina sudah tercapai!');
      } else {
        error('Failed to save pembina');
      }
    }
  };

  const handleClosePembinaModal = () => {
    setIsModalOpen(false);
    setEditingPembina(null);
    setPembinaFormData({
      nama: '',
      jabatan: '',
      nip: '',
      foto_url: '',
    });
  };

  const handlePembinaDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this pembina?')) {
      return;
    }

    try {
      await pembinaAPI.delete(id);
      success('Pembina deleted successfully');
      fetchPembina();
    } catch (err) {
      error('Failed to delete pembina');
    }
  };

  const handlePembinaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPembinaFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
            <h1 className="text-2xl font-bold text-gray-800">Struktur & Pembina Management</h1>
            <p className="text-gray-600">Manage organization structure and pembina</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('struktur')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'struktur'
                ? 'bg-white text-maroon-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Struktur Organisasi ({struktur.length})
          </button>
          <button
            onClick={() => setActiveTab('pembina')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'pembina'
                ? 'bg-white text-maroon-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pembina Organisasi ({pembina.length}/2)
          </button>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          {activeTab === 'struktur' ? (
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-maroon-700 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-maroon-md hover:shadow-maroon-lg hover:-translate-y-0.5"
            >
              <span className="mr-2 text-lg">+</span>
              Add Struktur
            </button>
          ) : (
            pembina.length < 2 && (
              <button
                onClick={() => handleOpenPembinaModal()}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="mr-2 text-lg">+</span>
                Add Pembina
              </button>
            )
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'struktur' ? (
          /* Struktur Grid */
          <div className="bg-white rounded-xl shadow-maroon-md border border-maroon-100 overflow-hidden">
          {struktur.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <span className="text-2xl text-purple-600">👥</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
              <p className="text-gray-500 mb-4">Start building your organization structure</p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white text-sm font-medium rounded-lg hover:from-maroon-800 hover:to-maroon-700 transition-all duration-300"
              >
                <span className="mr-2">+</span>
                Add Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-maroon-100">
                <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                      Jabatan
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                      Prodi
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                      Angkatan
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                      NRA
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-purple-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-maroon-100">
                  {struktur.map((item, index) => (
                    <tr key={`${item.id}-${item.nra || 'no-nra'}`} className="hover:bg-gradient-to-r hover:from-purple-25 hover:to-purple-50 transition-all duration-200">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="relative">
                          <OptimizedImage
                            src={item.foto_url}
                            alt={item.nama}
                            className="h-16 w-16 rounded-full shadow-maroon-sm border-2 border-purple-100"
                            fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='10'%3ENo Photo%3C/text%3E%3C/svg%3E"
                            loading="eager"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.nama}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          Member #{index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
                          {item.jabatan}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {item.prodi}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">
                          {item.angkatan}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">
                          {item.nra || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 text-xs font-medium rounded-lg hover:from-purple-100 hover:to-purple-200 hover:text-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
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
        ) : (
          /* Pembina Table */
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden backdrop-blur-sm">
            {pembina.length >= 2 && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-amber-800 text-sm font-medium">
                      <strong>Maksimal pembina tercapai!</strong> Anda sudah memiliki 2 pembina. Hapus salah satu untuk menambah yang baru.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {pembina.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 via-indigo-200 to-purple-200 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Belum Ada Pembina</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Tambahkan pembina untuk organisasi Anda. Maksimal 2 pembina dapat ditambahkan.</p>
                <button
                  onClick={() => handleOpenPembinaModal()}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Pembina
                </button>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                        <th className="px-8 py-4 text-center text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Foto
                          </div>
                        </th>
                        <th className="px-8 py-4 text-center text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Nama
                          </div>
                        </th>
                        <th className="px-8 py-4 text-center text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Jabatan
                          </div>
                        </th>
                        <th className="px-8 py-4 text-center text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            NIP
                          </div>
                        </th>
                        <th className="px-8 py-4 text-center text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                            Aksi
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {pembina.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-25 hover:to-purple-25 transition-all duration-300 group">
                          <td className="px-8 py-6 whitespace-nowrap text-center">
                            <div className="flex justify-center">
                              <div className="relative">
                                <div className="h-20 w-20 rounded-full overflow-hidden ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-300 shadow-lg">
                                  <OptimizedImage
                                    src={item.foto_url}
                                    alt={item.nama}
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3EFoto%3C/text%3E%3C/svg%3E"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-center">
                            <div className="text-base font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{item.nama}</div>
                            {item.nip && (
                              <div className="text-sm text-gray-500 mt-1 font-medium">NIP: {item.nip}</div>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-300 shadow-sm">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                              {item.jabatan}
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-center">
                            <div className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-3 py-2 inline-block min-w-[80px]">
                              {item.nip || (
                                <span className="text-gray-400 italic">Tidak ada</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-3">
                              <button
                                onClick={() => handleOpenPembinaModal(item)}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handlePembinaDelete(item.id)}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={editingPembina ? handleClosePembinaModal : handleCloseModal}
        title={
          editingPembina
            ? 'Edit Pembina'
            : editingStruktur
              ? 'Edit Member'
              : activeTab === 'pembina'
                ? 'Add Pembina'
                : 'Add Member'
        }
        size="lg"
      >
        <form onSubmit={editingPembina || activeTab === 'pembina' ? handlePembinaSubmit : handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="struktur-nama" className="block text-sm font-medium text-gray-700 mb-2">
                Nama
              </label>
              <input
                id="struktur-nama"
                type="text"
                name="nama"
                value={editingPembina || activeTab === 'pembina' ? pembinaFormData.nama : formData.nama}
                onChange={editingPembina || activeTab === 'pembina' ? handlePembinaInputChange : handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:border-maroon-700 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="struktur-jabatan" className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan
              </label>
              <input
                id="struktur-jabatan"
                type="text"
                name="jabatan"
                value={editingPembina || activeTab === 'pembina' ? pembinaFormData.jabatan : formData.jabatan}
                onChange={editingPembina || activeTab === 'pembina' ? handlePembinaInputChange : handleInputChange}
                placeholder={editingPembina || activeTab === 'pembina' ? "e.g., Pembina, Pembina Utama" : "e.g., Ketua, Sekretaris, Anggota"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:border-maroon-700 transition-colors"
                required
              />
            </div>
          </div>

          {/* Conditional fields based on tab */}
          {!(editingPembina || activeTab === 'pembina') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="struktur-prodi" className="block text-sm font-medium text-gray-700 mb-2">
                  Program Studi
                </label>
                <select
                  id="struktur-prodi"
                  name="prodi"
                  value={formData.prodi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                  required
                >
                  <option value="">Pilih Program Studi</option>
                  <option value="Teknik Telekomunikasi">Teknik Telekomunikasi</option>
                  <option value="Teknologi Informasi">Teknologi Informasi</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Desain Komunikasi Visual">Desain Komunikasi Visual</option>
                </select>
              </div>

              <div>
                <label htmlFor="struktur-angkatan" className="block text-sm font-medium text-gray-700 mb-2">
                  Angkatan
                </label>
                <input
                  id="struktur-angkatan"
                  type="text"
                  name="angkatan"
                  value={formData.angkatan}
                  onChange={handleInputChange}
                  placeholder="e.g., 2021"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="struktur-nra" className="block text-sm font-medium text-gray-700 mb-2">
              {editingPembina || activeTab === 'pembina' ? 'NIP' : 'NRA'}
            </label>
            <input
              id="struktur-nra"
              type="text"
              name={editingPembina || activeTab === 'pembina' ? 'nip' : 'nra'}
              value={editingPembina || activeTab === 'pembina' ? pembinaFormData.nip : formData.nra}
              onChange={editingPembina || activeTab === 'pembina' ? handlePembinaInputChange : handleInputChange}
              placeholder={editingPembina || activeTab === 'pembina' ? "e.g., 123456789" : "e.g., AB 01 001 KP"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-700 focus:border-maroon-700 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="struktur-foto" className="block text-sm font-medium text-gray-700 mb-2">
              Foto
            </label>
            <input
              id="struktur-foto"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maroon file:text-white hover:file:bg-red-800"
              disabled={uploading}
            />
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading...</p>
            )}
            {(editingPembina || activeTab === 'pembina' ? pembinaFormData.foto_url : formData.foto_url) && (
              <div className="mt-2">
                <OptimizedImage
                  src={editingPembina || activeTab === 'pembina' ? pembinaFormData.foto_url : formData.foto_url}
                  alt="Preview"
                  className="h-32 w-32 rounded-full"
                  fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3EPreview%3C/text%3E%3C/svg%3E"
                  loading="eager"
                />
              </div>
            )}
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
              {editingStruktur ? 'Update Member' : 'Create Member'}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminStrukturPage;
