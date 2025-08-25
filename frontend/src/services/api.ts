import axios from 'axios';

// Types
export interface Banner {
  id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Kegiatan {
  id: number;
  judul: string;
  deskripsi: string;
  cover: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
  fotos?: KegiatanFoto[];
}

export interface KegiatanFoto {
  id: number;
  kegiatan_id: number;
  image_url: string;
  caption?: string;
  sort_order?: number;
  created_at: string;
  updated_at?: string;
}

export interface Struktur {
  id: number;
  nama: string;
  jabatan: string;
  prodi: string;
  angkatan: string;
  nra: string;
  foto_url: string;
  created_at: string;
  updated_at: string;
}

export interface Pembina {
  id: number;
  nama: string;
  jabatan: string;
  nip: string;
  foto_url: string;
  created_at: string;
  updated_at: string;
}

export interface QRCode {
  id: number;
  image_url: string;
  keterangan: string;
  enable: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Helper function to resolve image URLs
export const resolveImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';

  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If starts with /uploads/, prepend API base URL
  if (imageUrl.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  // If relative path, prepend API base URL
  return `${API_BASE_URL}/${imageUrl.replace(/^\//, '')}`;
};

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/admin/login', credentials);
    return response.data.data;
  },
};

// Banner API
export const bannerAPI = {
  getAll: async (): Promise<Banner[]> => {
    const response = await api.get<ApiResponse<Banner[]>>('/banners');
    return response.data.data;
  },
  getById: async (id: number): Promise<Banner> => {
    const response = await api.get<ApiResponse<Banner>>(`/banners/${id}`);
    return response.data.data;
  },
  create: async (banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Promise<Banner> => {
    const response = await api.post<ApiResponse<Banner>>('/admin/banners', banner);
    return response.data.data;
  },
  update: async (id: number, banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Promise<Banner> => {
    const response = await api.put<ApiResponse<Banner>>(`/admin/banners/${id}`, banner);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/banners/${id}`);
  },
};

// Kegiatan API
export const kegiatanAPI = {
  getAll: async (): Promise<Kegiatan[]> => {
    const response = await api.get<ApiResponse<Kegiatan[]>>('/kegiatan');
    return response.data.data;
  },
  getById: async (id: number): Promise<Kegiatan> => {
    const response = await api.get<ApiResponse<Kegiatan>>(`/kegiatan/${id}`);
    return response.data.data;
  },
  create: async (kegiatan: Omit<Kegiatan, 'id' | 'created_at' | 'updated_at' | 'fotos'>): Promise<Kegiatan> => {
    const response = await api.post<ApiResponse<Kegiatan>>('/admin/kegiatan', kegiatan);
    return response.data.data;
  },
  update: async (id: number, kegiatan: Omit<Kegiatan, 'id' | 'created_at' | 'updated_at' | 'fotos'>): Promise<Kegiatan> => {
    const response = await api.put<ApiResponse<Kegiatan>>(`/admin/kegiatan/${id}`, kegiatan);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/kegiatan/${id}`);
  },
};

// Struktur API
export const strukturAPI = {
  getAll: async (): Promise<Struktur[]> => {
    const response = await api.get<ApiResponse<Struktur[]>>(`/struktur?t=${Date.now()}`);
    return response.data.data;
  },
  getById: async (id: number): Promise<Struktur> => {
    const response = await api.get<ApiResponse<Struktur>>(`/admin/struktur/${id}`);
    return response.data.data;
  },
  create: async (struktur: Omit<Struktur, 'id' | 'created_at' | 'updated_at'>): Promise<Struktur> => {
    console.log('strukturAPI.create data:', struktur); // Debug log
    const response = await api.post<ApiResponse<Struktur>>('/admin/struktur', struktur);
    return response.data.data;
  },
  update: async (id: number, struktur: Omit<Struktur, 'id' | 'created_at' | 'updated_at'>): Promise<Struktur> => {
    console.log('strukturAPI.update data:', { id, struktur }); // Debug log
    const response = await api.put<ApiResponse<Struktur>>(`/admin/struktur/${id}`, struktur);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/struktur/${id}`);
  },
};

// Pembina API
export const pembinaAPI = {
  getAll: async (): Promise<Pembina[]> => {
    const response = await api.get<ApiResponse<Pembina[]>>(`/pembina?t=${Date.now()}`);
    return response.data.data;
  },
  getById: async (id: number): Promise<Pembina> => {
    const response = await api.get<ApiResponse<Pembina>>(`/admin/pembina/${id}`);
    return response.data.data;
  },
  create: async (pembina: Omit<Pembina, 'id' | 'created_at' | 'updated_at'>): Promise<Pembina> => {
    console.log('pembinaAPI.create data:', pembina); // Debug log
    const response = await api.post<ApiResponse<Pembina>>('/admin/pembina', pembina);
    return response.data.data;
  },
  update: async (id: number, pembina: Omit<Pembina, 'id' | 'created_at' | 'updated_at'>): Promise<Pembina> => {
    console.log('pembinaAPI.update data:', { id, pembina }); // Debug log
    const response = await api.put<ApiResponse<Pembina>>(`/admin/pembina/${id}`, pembina);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/pembina/${id}`);
  },
};

// QR Code API
export const qrcodeAPI = {
  getAll: async (): Promise<QRCode[]> => {
    const response = await api.get<ApiResponse<QRCode[]>>('/admin/qrcode');
    return response.data.data;
  },
  getEnabled: async (): Promise<QRCode[]> => {
    const response = await api.get<ApiResponse<QRCode[]>>('/qrcode/enabled');
    return response.data.data;
  },
  getById: async (id: number): Promise<QRCode> => {
    const response = await api.get<ApiResponse<QRCode>>(`/admin/qrcode/${id}`);
    return response.data.data;
  },
  create: async (qrcode: Omit<QRCode, 'id' | 'created_at' | 'updated_at'>): Promise<QRCode> => {
    const response = await api.post<ApiResponse<QRCode>>('/admin/qrcode', qrcode);
    return response.data.data;
  },
  update: async (id: number, qrcode: Omit<QRCode, 'id' | 'created_at' | 'updated_at'>): Promise<QRCode> => {
    const response = await api.put<ApiResponse<QRCode>>(`/admin/qrcode/${id}`, qrcode);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/qrcode/${id}`);
  },
  toggle: async (id: number): Promise<void> => {
    await api.put(`/admin/qrcode/${id}/toggle`);
  },
};

// Kegiatan Photos API
export const kegiatanPhotosAPI = {
  getByKegiatanId: async (kegiatanId: number): Promise<KegiatanFoto[]> => {
    const response = await api.get<ApiResponse<KegiatanFoto[]>>(`/kegiatan/${kegiatanId}/photos`);
    return response.data.data;
  },
  create: async (kegiatanId: number, photo: { image_url: string; caption: string; sort_order: number }): Promise<KegiatanFoto> => {
    const response = await api.post<ApiResponse<KegiatanFoto>>(`/admin/kegiatan/${kegiatanId}/photos`, photo);
    return response.data.data;
  },
  update: async (photoId: number, photo: { image_url: string; caption: string; sort_order: number }): Promise<KegiatanFoto> => {
    const response = await api.put<ApiResponse<KegiatanFoto>>(`/admin/photos/${photoId}`, photo);
    return response.data.data;
  },
  delete: async (photoId: number): Promise<void> => {
    await api.delete(`/admin/photos/${photoId}`);
  },
  updateSortOrder: async (photos: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await api.put('/admin/photos/sort-order', { photos });
  },
};

// Upload API
export const uploadAPI = {
  single: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ApiResponse<{ url: string; filename: string }>>(
      '/admin/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.url;
  },
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ApiResponse<{ url: string; filename: string }>>(
      '/admin/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
  uploadMultipleImages: async (files: File[]): Promise<{ url: string; filename: string }[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<ApiResponse<{ url: string; filename: string }[]>>(
      '/admin/upload/images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
};
