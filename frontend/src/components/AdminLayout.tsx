import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  PhotoIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  QrCodeIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: HomeIcon, description: 'Overview & Statistics' },
    { path: '/admin/banner', label: 'Banner', icon: PhotoIcon, description: 'Manage Website Banners' },
    { path: '/admin/kegiatan', label: 'Kegiatan', icon: CalendarDaysIcon, description: 'Activities & Events' },
    { path: '/admin/struktur', label: 'Struktur', icon: UserGroupIcon, description: 'Organization Members' },
    { path: '/admin/qrcode', label: 'QR Code', icon: QrCodeIcon, description: 'QR Code Management' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-maroon-700 to-maroon-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-maroon-xl`}>

        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-maroon-800/30">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/AB.PNG"
              alt="AB Logo"
              className="h-10 w-10 object-contain drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                Admin Panel
              </h2>
              <p className="text-red-200 text-sm font-medium">Arshaka Bimantara</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-red-800/50 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-white/10 text-white shadow-lg border-l-4 border-red-300'
                    : 'text-red-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <IconComponent className={`mr-4 h-6 w-6 transition-colors ${
                  isActive(item.path) ? 'text-red-300' : 'text-red-200 group-hover:text-white'
                }`} />
                <span className="flex-1">
                  <span className="block font-semibold">{item.label}</span>
                  <span className="block text-xs text-red-200/80 group-hover:text-red-100/80">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-800/30">
          <div className="flex items-center mb-4 px-4 py-2 bg-white/5 rounded-lg">
            <div className="w-8 h-8 bg-red-300 rounded-full flex items-center justify-center mr-3">
              <span className="bg-gradient-to-r from-maroon-700 to-maroon-800 bg-clip-text text-transparent font-bold text-sm">
                {JSON.parse(localStorage.getItem('admin_user') || '{}').username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">
                {JSON.parse(localStorage.getItem('admin_user') || '{}').username || 'Admin'}
              </div>
              <div className="text-xs text-red-200">Administrator</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-200 hover:text-white hover:bg-red-800/50 rounded-lg transition-colors group"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 group-hover:text-white" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-4"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {menuItems.find(item => isActive(item.path))?.label || 'Admin Panel'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {menuItems.find(item => isActive(item.path))?.description || 'Manage your website content'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 border border-maroon-200 text-sm font-medium rounded-lg bg-gradient-to-r from-maroon-50 to-red-50 hover:from-maroon-100 hover:to-red-100 text-maroon-700 hover:text-maroon-800 transition-all duration-300 shadow-maroon-sm hover:shadow-maroon-md"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View Site</span>
                </Link>

                {/* User menu - desktop only, mobile shows in sidebar */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {JSON.parse(localStorage.getItem('admin_user') || '{}').username || 'Admin'}
                    </div>
                    <div className="text-xs text-gray-500">Administrator</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-maroon-700 to-maroon-800 rounded-full flex items-center justify-center shadow-maroon-sm">
                    <span className="text-white font-bold text-sm">
                      {JSON.parse(localStorage.getItem('admin_user') || '{}').username?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
