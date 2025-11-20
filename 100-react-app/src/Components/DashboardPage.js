import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// jwt-decode opsional, jika Anda sudah menginstalnya sesuai modul (npm install jwt-decode)
// import { jwtDecode } from "jwt-decode"; 

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', role: 'Member' });

  useEffect(() => {
    // Cek apakah ada token, jika tidak ada, tendang ke login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    
    // Jika Anda menggunakan jwt-decode sesuai modul baris 164:
    // if (token) {
    //    try {
    //      const decoded = jwtDecode(token);
    //      setUser({ name: decoded.username || 'User', role: decoded.role || 'Member' });
    //    } catch (e) { console.error(e); }
    // }
  }, [navigate]);

  const handleLogout = () => {
    // 1. Hapus token dari localStorage
    localStorage.removeItem('token');
    // 2. Arahkan kembali ke halaman login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      
      {/* Container Utama (Card) */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl text-center transform transition duration-500 hover:scale-105">
        
        {/* Header Card */}
        <div className="bg-blue-800 p-6">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Dashboard Utama
          </h1>
          <p className="text-blue-200 mt-2">Selamat Datang di Aplikasi PAW</p>
        </div>

        {/* Body Card */}
        <div className="p-8">
          <div className="mb-8">
            <div className="inline-block p-4 rounded-full bg-green-100 text-green-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Login Berhasil!</h2>
            <p className="text-gray-600 mt-2">
              Anda telah berhasil masuk ke dalam sistem. Token sesi Anda aman tersimpan.
            </p>
          </div>

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-300 ease-in-out"
          >
            Logout Sekarang
          </button>
        </div>
        
        {/* Footer Card */}
        <div className="bg-gray-50 p-4 text-sm text-gray-500 border-t">
          &copy; 2025 Tugas Modul 7 - Integrasi Frontend Backend
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;