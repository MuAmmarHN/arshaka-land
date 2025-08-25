import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { bannerAPI, kegiatanAPI, strukturAPI, pembinaAPI, qrcodeAPI } from '../../services/api';
import {
  PhotoIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  QrCodeIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  PlusIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    banners: 0,
    kegiatan: 0,
    struktur: 0,
    pembina: 0,
    qrcode: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [banners, kegiatan, struktur, pembina, qrcode] = await Promise.all([
        bannerAPI.getAll(),
        kegiatanAPI.getAll(),
        strukturAPI.getAll(),
        pembinaAPI.getAll(),
        qrcodeAPI.getAll(),
      ]);

      setStats({
        banners: banners.length,
        kegiatan: kegiatan.length,
        struktur: struktur.length,
        pembina: pembina.length,
        qrcode: qrcode.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Banner',
      value: stats.banners,
      description: 'Active banners',
      icon: PhotoIcon,
      color: 'blue',
      bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      link: '/admin/banner'
    },
    {
      title: 'Kegiatan',
      value: stats.kegiatan,
      description: 'Total activities',
      icon: CalendarDaysIcon,
      color: 'green',
      bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
      iconColor: 'text-green-600',
      link: '/admin/kegiatan'
    },
    {
      title: 'Struktur',
      value: stats.struktur,
      description: 'Team members',
      icon: UserGroupIcon,
      color: 'purple',
      bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      link: '/admin/struktur'
    },
    {
      title: 'Pembina',
      value: stats.pembina || 0,
      description: 'Pembina organisasi',
      icon: UserGroupIcon,
      color: 'indigo',
      bgColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
      iconColor: 'text-indigo-600',
      link: '/admin/struktur'
    },
    {
      title: 'QR Code',
      value: stats.qrcode,
      description: 'QR codes',
      icon: QrCodeIcon,
      color: 'amber',
      bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100',
      iconColor: 'text-amber-600',
      link: '/admin/qrcode'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-maroon to-red-800 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {JSON.parse(localStorage.getItem('admin_user') || '{}').username || 'Admin'}! 👋
              </h1>
              <p className="text-red-100 text-lg">
                Here's what's happening with your website today.
              </p>
            </div>
            <div className="hidden lg:block">
              <ChartBarIcon className="h-24 w-24 text-red-200 opacity-50" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200 block"
              >
                <span className="block p-6">
                  <span className="flex items-center justify-between mb-4">
                    <span className={`inline-block p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
                    </span>
                    <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                  </span>

                  <span className="block space-y-1">
                    <span className="block text-sm font-medium text-gray-600">{card.title}</span>
                    <span className="block text-3xl font-bold text-gray-900">
                      {loading ? (
                        <span className="inline-block animate-pulse bg-gray-200 h-8 w-12 rounded"></span>
                      ) : (
                        card.value
                      )}
                    </span>
                    <span className="block text-sm text-gray-500">{card.description}</span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <PlusIcon className="h-6 w-6 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statsCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <Link
                    key={card.title}
                    to={card.link}
                    className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-maroon-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200"
                  >
                    <span className={`inline-block p-2 rounded-lg ${card.bgColor} mr-3 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-5 w-5 ${card.iconColor}`} />
                    </span>
                    <span>
                      <span className="block font-medium text-gray-900 group-hover:bg-gradient-to-r group-hover:from-maroon-700 group-hover:to-maroon-800 group-hover:bg-clip-text group-hover:text-transparent">
                        Manage {card.title}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {card.value} items
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Website Overview</h3>
              <EyeIcon className="h-6 w-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Website Status</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Total Content</span>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {loading ? '...' : stats.banners + stats.kegiatan + stats.struktur + stats.qrcode} items
                </span>
              </div>

              <Link
                to="/"
                target="_blank"
                className="w-full flex items-center justify-center px-4 py-3 bg-maroon text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                View Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
