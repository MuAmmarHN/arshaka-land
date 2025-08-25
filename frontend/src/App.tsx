import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import KegiatanDetailPage from './pages/KegiatanDetailPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBannerPage from './pages/admin/AdminBannerPage';
import AdminKegiatanPage from './pages/admin/AdminKegiatanPage';
import AdminStrukturPage from './pages/admin/AdminStrukturPage';
import AdminQRCodePage from './pages/admin/AdminQRCodePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/kegiatan/:id" element={<KegiatanDetailPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/banner" element={<AdminBannerPage />} />
          <Route path="/admin/kegiatan" element={<AdminKegiatanPage />} />
          <Route path="/admin/struktur" element={<AdminStrukturPage />} />
          <Route path="/admin/qrcode" element={<AdminQRCodePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
