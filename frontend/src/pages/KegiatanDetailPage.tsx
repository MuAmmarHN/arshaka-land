import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { ArrowLeftIcon, CalendarDaysIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { kegiatanAPI, Kegiatan } from '../services/api';
import OptimizedImage from '../components/OptimizedImage';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const KegiatanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Use real photos from API or fallback to mock data
  const photos = React.useMemo(() => {
    if (kegiatan?.fotos && kegiatan.fotos.length > 0) {
      return kegiatan.fotos.map(foto => ({
        id: foto.id,
        image_url: foto.image_url,
        caption: foto.caption || `Photo ${foto.id}`,
      }));
    }

    // Fallback to cover image if no photos
    if (kegiatan?.cover) {
      return [
        { id: 1, image_url: kegiatan.cover, caption: 'Cover kegiatan' },
      ];
    }

    return [];
  }, [kegiatan]);

  useEffect(() => {
    if (id) {
      fetchKegiatan(parseInt(id));
    }
  }, [id]);

  const fetchKegiatan = async (kegiatanId: number) => {
    try {
      const data = await kegiatanAPI.getById(kegiatanId);
      setKegiatan(data);
    } catch (error) {
      console.error('Error fetching kegiatan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-maroon">Loading...</div>
      </div>
    );
  }

  if (!kegiatan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kegiatan tidak ditemukan</h1>
          <Link to="/" className="text-maroon hover:text-red-800">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-maroon hover:text-red-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Photo Gallery */}
          <div className="mb-8">
            {photos && photos.length > 0 ? (
              <div className="space-y-4">
                {/* Main Photo Carousel */}
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                    className="main-photo-swiper rounded-2xl overflow-hidden shadow-lg"
                    style={{ aspectRatio: '16/10' }}
                  >
                    {photos.map((photo) => (
                      <SwiperSlide key={photo.id}>
                        <div className="relative w-full h-full">
                          <OptimizedImage
                            src={photo.image_url}
                            alt={photo.caption}
                            className="w-full h-full"
                            fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='20'%3EPhoto%3C/text%3E%3C/svg%3E"
                            loading="eager"
                          />
                          {photo.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                              <p className="text-white text-sm font-medium">{photo.caption}</p>
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Thumbnail Navigation */}
                {photos && photos.length > 1 && (
                  <div className="px-2">
                    <Swiper
                      modules={[Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={12}
                      slidesPerView={4}
                      breakpoints={{
                        640: { slidesPerView: 5 },
                        768: { slidesPerView: 6 },
                        1024: { slidesPerView: 8 },
                      }}
                      watchSlidesProgress
                      className="thumb-swiper"
                    >
                      {photos.map((photo) => (
                        <SwiperSlide key={photo.id}>
                          <div className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-maroon transition-all">
                            <OptimizedImage
                              src={photo.image_url}
                              alt={photo.caption}
                              className="w-full h-full"
                              fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='10'%3EThumb%3C/text%3E%3C/svg%3E"
                              loading="lazy"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PhotoIcon className="h-16 w-16 mx-auto mb-4" />
                  <p>Belum ada foto untuk kegiatan ini</p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Date Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-maroon/10 text-maroon rounded-full text-sm font-medium">
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                {new Date(kegiatan.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {kegiatan.judul}
            </h1>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {kegiatan.deskripsi}
              </div>
            </div>

            {/* Photo Count */}
            {photos && photos.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <PhotoIcon className="h-4 w-4 mr-2" />
                  {photos.length} foto dokumentasi
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KegiatanDetailPage;
