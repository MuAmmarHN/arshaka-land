import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { bannerAPI, kegiatanAPI, strukturAPI, pembinaAPI, qrcodeAPI, Banner, Kegiatan, Struktur, Pembina, QRCode } from '../services/api';
import OptimizedImage from '../components/OptimizedImage';

const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [struktur, setStruktur] = useState<Struktur[]>([]);
  const [pembina, setPembina] = useState<Pembina[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all data in parallel
      const [bannersData, kegiatanData, strukturData, pembinaData, qrCodesData] = await Promise.all([
        bannerAPI.getAll(),
        kegiatanAPI.getAll(),
        strukturAPI.getAll(),
        pembinaAPI.getAll(),
        qrcodeAPI.getEnabled(),
      ]);

      setBanners(Array.isArray(bannersData) ? bannersData : []);
      setKegiatan(Array.isArray(kegiatanData) ? kegiatanData : []);
      setStruktur(Array.isArray(strukturData) ? strukturData : []);
      setPembina(Array.isArray(pembinaData) ? pembinaData : []);
      setQrCodes(Array.isArray(qrCodesData) ? qrCodesData : []);

      // Debug log untuk struktur data
      console.log('HomePage struktur data:', strukturData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays as fallback
      setBanners([]);
      setKegiatan([]);
      setStruktur([]);
      setQrCodes([]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen homepage-background relative">
      {/* Header */}
      <header className="bg-white shadow-sm relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="mx-auto h-32 w-32 mb-4 flex items-center justify-center">
              <img
                src="/assets/AB.PNG"
                alt="Arshaka Bimantara Logo"
                className="h-32 w-32 object-contain"
                onError={(e) => {
                  // Hide image if not found and show placeholder
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div
                className="h-32 w-32 bg-gradient-to-br from-maroon-100 to-maroon-200 rounded-full items-center justify-center font-bold text-3xl text-maroon-800"
                style={{ display: 'none' }}
              >
                AB
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent mb-2">
              Arshaka Bimantara
              <div className="w-32 h-1 bg-gradient-to-r from-maroon-700 to-maroon-800 mx-auto mt-2 rounded-full"></div>
            </h1>
            <p className="bg-gradient-to-r from-maroon-600 to-maroon-800 bg-clip-text text-transparent text-xl mb-4">Mahasiswa pecinta Alam Telkom University Jakarta</p>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Arshaka Bimantara Adalah Unit Kegiatan Mahasiswa Telkom University Jakarta yang mewadahi Mahasiswa yang mencintai dan peduli tentang alam, Arshaka bimantara yang berarti "Jiwa Yang Hebat Berakar Kuat".
            </p>
          </div>
        </div>
      </header>

      {/* Banner Carousel - Full Width */}
      {banners && banners.length > 0 && (
        <section className="w-full relative z-10">
          <div className="w-full">
            <div className="w-full bg-gray-200 overflow-hidden" style={{ aspectRatio: '21/9' }}>
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="w-full h-full banner-swiper"
              >
                {banners.map((banner) => (
                  <SwiperSlide key={banner.id}>
                    <OptimizedImage
                      src={banner.image_url}
                      alt={`Banner ${banner.id}`}
                      className="w-full h-full"
                      fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='24'%3EBanner%3C/text%3E%3C/svg%3E"
                      loading="eager"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Sejarah Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent mb-6">Sejarah Singkat</h2>
              <p className="text-gray-700 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-700">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <div>
              <div className="w-full h-64 bg-gradient-to-br from-maroon-100 to-maroon-200 rounded-lg shadow-md flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <div className="text-maroon-800 font-semibold">Sejarah</div>
                  <div className="text-maroon-600 text-sm">Arshaka Bimantara</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-20 relative overflow-hidden">

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-maroon-700 via-maroon-800 to-maroon-900 bg-clip-text text-transparent mb-4">
                Visi & Misi
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-maroon-600 to-maroon-800 mx-auto rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
              Fondasi dan arah perjalanan Arshaka Bimantara dalam mewujudkan cita-cita bersama
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Visi Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gray-400 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                <div className="text-center">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent mb-8">
                    Visi
                  </h3>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-maroon-50 to-transparent rounded-lg opacity-50"></div>
                    <p className="relative text-gray-700 text-lg leading-relaxed font-medium">
                      ARSHAKA BIMANTARA sebagai organisasi kepecintaalaman akan senantiasa menggalang persatuan dan kerja sama antar sesama kelompok pecinta alam dalam mengembangkan kegiatan kepecintaalaman untuk menunjang pembangunan nasional sesuai dengan asas dan kode etik kepecintaalaman dan menjadikan mahasiswa Pecintaalam yang sadar akan kepedulian lingkungan hidup serta menjadikan mahasiswa yang dapat berkomunikasi dan berkontribusi di masyarakat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Misi Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gray-400 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent">
                    Misi
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    "Mempererat tali persaudaraan antar sesama anggota maupun sesama kelompok pecintaalam.",
                    "Menjalin hubungan kerjasama yang dinamis dan tidak mengikat serta koordinasi diantara pecinta alam.",
                    "Meningkatkan peran aktif kelompok pecinta alam dalam menanggapi masalah-masalah lingkungan serta berusaha mengembalikan citra baik kelompok pecinta alam.",
                    "Membangun hubungan baik dengan pihak eksternal atau masyarakat."
                  ].map((misi, index) => (
                    <div key={index} className="flex items-start group/item">
                      <div className="relative mr-4 mt-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-maroon-600 to-maroon-700 rounded-full flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium leading-relaxed group-hover/item:text-gray-900 transition-colors duration-300">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kegiatan Section */}
      {kegiatan && kegiatan.length > 0 && (
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent text-center mb-12">Kegiatan Terbaru</h2>
            <div className="relative" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet kegiatan-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active kegiatan-bullet-active',
                  dynamicBullets: false,
                  renderBullet: function (_index: number, className: string) {
                    return '<span class="' + className + '"></span>';
                  },
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={kegiatan.length > 3}
                className="kegiatan-swiper pb-12"
              >
                {kegiatan.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Link
                      to={`/kegiatan/${item.id}`}
                      className="block group"
                    >
                      <div className="card bg-white rounded-xl shadow-maroon-sm border border-maroon-100 overflow-hidden hover:shadow-maroon-lg transition-all duration-300 group-hover:-translate-y-2 hover:border-maroon-300 h-full flex flex-col mx-2">
                        <div className="aspect-video overflow-hidden">
                          <OptimizedImage
                            src={item.cover}
                            alt={item.judul}
                            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                            fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='16'%3EKegiatan%3C/text%3E%3C/svg%3E"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white text-xs font-medium rounded-full shadow-maroon-sm">
                              {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-maroon-700 group-hover:to-maroon-800 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{item.judul}</h3>
                          <div className="flex-1">
                            <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-1">
                              {item.deskripsi.length > 60
                                ? `${item.deskripsi.substring(0, 60)}...`
                                : item.deskripsi
                              }
                            </p>
                            {item.deskripsi.length > 60 && (
                              <span className="text-maroon-700 text-xs font-medium hover:text-maroon-800 transition-colors cursor-pointer">
                                Read more →
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Pembina Organisasi Section */}
      {pembina && pembina.length > 0 && (
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent">Pembina</h2>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent">Arshaka Bimantara</h2>
              <p className="text-lg text-gray-600 mt-2 font-medium">2024/2025</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {pembina.map((person) => (
                <div key={person.id} className="group text-center w-48 flex-shrink-0">
                  <div className="relative mb-6">
                    <div className="w-48 h-64 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300" style={{ aspectRatio: '3/4' }}>
                      <OptimizedImage
                        src={person.foto_url}
                        alt={person.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='256'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3EPhoto%3C/text%3E%3C/svg%3E"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-maroon text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg">
                        {person.jabatan}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-maroon-700 group-hover:to-maroon-800 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{person.nama}</h3>
                    <div className="space-y-1">
                      {person.nip && (
                        <p className="text-xs text-maroon-600 bg-maroon-50 inline-block px-3 py-1 rounded-full font-medium">
                           {person.nip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pembina Organisasi Section */}
      {struktur && struktur.filter(person => person.jabatan.toLowerCase().includes('pembina')).length > 0 && (
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent">Pembina Organisasi</h2>
              <p className="text-lg text-gray-600 mt-2 font-medium">2024/2025</p>
            </div>
            <div className="relative" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet pembina-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active pembina-bullet-active',
                  dynamicBullets: false,
                  renderBullet: function (_index: number, className: string) {
                    return '<span class="' + className + '"></span>';
                  },
                }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                loop={pembina.length > 4}
                className="pembina-swiper pb-12"
              >
                {pembina.map((person) => (
                  <SwiperSlide key={person.id}>
                    <div className="group text-center">
                      <div className="relative mb-6">
                        <div className="w-48 h-64 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300" style={{ aspectRatio: '3/4' }}>
                          <OptimizedImage
                            src={person.foto_url}
                            alt={person.nama}
                            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                            fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='256'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3EPhoto%3C/text%3E%3C/svg%3E"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-maroon text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg">
                            {person.jabatan}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-maroon-700 group-hover:to-maroon-800 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{person.nama}</h3>
                        <div className="space-y-1">
                          {person.nip && (
                            <p className="text-xs text-maroon-600 bg-maroon-50 inline-block px-3 py-1 rounded-full font-medium">
                            {person.nip}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Struktur Organisasi Section */}
      {struktur && struktur.length > 0 && (
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent">Struktur</h2>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent">Arshaka Bimantara</h2>
              <p className="text-lg text-gray-600 mt-2 font-medium">2024/2025</p>
            </div>
            <div className="relative" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet struktur-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active struktur-bullet-active',
                  dynamicBullets: false,
                  renderBullet: function (_index: number, className: string) {
                    return '<span class="' + className + '"></span>';
                  },
                }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                loop={struktur.length > 4}
                className="struktur-swiper pb-12"
              >
                {struktur.map((person) => (
                  <SwiperSlide key={person.id}>
                    <div className="group text-center">
                      <div className="relative mb-6">
                        <div className="w-48 h-64 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300" style={{ aspectRatio: '3/4' }}>
                          <OptimizedImage
                            src={person.foto_url}
                            alt={person.nama}
                            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                            fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='256'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3EPhoto%3C/text%3E%3C/svg%3E"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-maroon text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg">
                            {person.jabatan}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-maroon-700 group-hover:to-maroon-800 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{person.nama}</h3>
                        <div className="space-y-1">
                          {person.nra && (
                            <p className="text-xs text-maroon-600 bg-maroon-50 inline-block px-3 py-1 rounded-full font-medium">
                              {person.nra}
                            </p>
                          )}
                          <p className="text-sm font-medium text-gray-700">{person.prodi}</p>
                          <p className="text-xs text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-full">
                            Angkatan {person.angkatan}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* QR Code Section */}
      {qrCodes && qrCodes.length > 0 && (
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent text-center mb-12">QR Code</h2>
            <div className="flex justify-center">
              <div className={`grid gap-8 ${
                qrCodes.length === 1
                  ? 'grid-cols-1 max-w-sm'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {qrCodes.map((qr) => (
                  <div key={qr.id} className="card text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <img
                      src={qr.image_url}
                      alt={`QR Code ${qr.id}`}
                      className={`mx-auto object-contain rounded-lg ${
                        qrCodes.length === 1 ? 'w-64 h-64' : 'w-48 h-48'
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3EQR Code%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {qrCodes.length === 1 && (
                      <div className="mt-4">
                        <p className="text-gray-600 text-sm">Scan QR Code untuk informasi lebih lanjut</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-maroon-800 to-maroon-700 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <img
                  src="/assets/AB.PNG"
                  alt="Arshaka Bimantara Logo"
                  className="h-10 w-10 mr-3"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h3 className="text-xl font-bold text-white">Arshaka Bimantara</h3>
              </div>
              <p className="text-red-100 text-sm leading-relaxed mb-6">
                Mahasiswa pecinta Alam Telkom University Jakarta yang mewadahi Mahasiswa yang mencintai dan peduli tentang alam.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/arshakabimantaraa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://youtube.com/@arshakabimantaraa?si=HjRAzntAxBfmKj7N" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@arshaka.bimantara?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a href="https://wa.me/6281585559895" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Menu</h4>
              <ul className="space-y-3">
                <li><a href="#beranda" className="text-red-100 hover:text-white transition-colors text-sm">Beranda</a></li>
                <li><a href="#sejarah" className="text-red-100 hover:text-white transition-colors text-sm">Sejarah</a></li>
                <li><a href="#kegiatan" className="text-red-100 hover:text-white transition-colors text-sm">Kegiatan</a></li>
                <li><a href="#struktur" className="text-red-100 hover:text-white transition-colors text-sm">Struktur Organisasi</a></li>
                <li><a href="#kontak" className="text-red-100 hover:text-white transition-colors text-sm">Kontak</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Kontak</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 text-red-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-red-100 text-sm">
                    <p>Jl. Halimun Raya No.2, RT.15/RW.6</p>
                    <p>Guntur, Kecamatan Setiabudi</p>
                    <p>Kota Jakarta Selatan, DKI Jakarta 12980</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <span className="text-red-100 text-sm">+62 815-8555-9895</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className="text-red-100 text-sm">arshakabimantara1@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Newsletter</h4>
              <p className="text-red-100 text-sm mb-4">Dapatkan update terbaru tentang kegiatan kami</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-red-200 text-sm focus:outline-none focus:border-white/40"
                />
                <button className="px-4 py-2 bg-white text-maroon-700 rounded-r-lg hover:bg-red-50 transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-red-200 text-sm mb-4 md:mb-0">
                © 2024 Arshaka Bimantara. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#privacy" className="text-red-200 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#terms" className="text-red-200 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#sitemap" className="text-red-200 hover:text-white text-sm transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
