import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import Navbar from './Navbar';

function DashboardPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); 
            return;
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setUser(decoded); 
            }
        } catch (error) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    if (!user) {
        return (
            <>
                <Navbar /> 
                <div className="text-center mt-20 p-8">Memuat Dashboard...</div>
            </>
        );
    }

    return (
        <>
        <Navbar /> 
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
            <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-xl text-center border-t-8 border-indigo-600 transform hover:scale-[1.01] transition duration-300">
                
                {/* Judul Utama */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    Selamat Datang, {user.nama || user.email}!
                </h1>
                <p className="text-lg text-gray-500 mb-10">
                    Ini adalah halaman utama sistem presensi Anda.
                </p>
                
                {/* Area Status & Aksi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kotak Aksi Presensi */}
                    <div 
                        onClick={() => navigate('/presensi')}
                        className="p-6 bg-indigo-500 text-white rounded-xl shadow-lg cursor-pointer hover:bg-indigo-700 transition duration-200 transform hover:-translate-y-1"
                    >
                        <h2 className="text-2xl font-bold mb-1">Presensi Harian</h2>
                        <p className="text-sm">Lakukan Check-In dan Check-Out Anda.</p>
                        <span className="mt-3 inline-block font-bold text-lg">➡️ Mulai Sekarang</span>
                    </div>

                    {/* Kotak Status Role */}
                    <div className="p-6 bg-gray-100 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold mb-1 text-gray-800">Status Akun</h2>
                        <p className="text-3xl font-extrabold text-indigo-500 uppercase mt-3">
                            {user.role}
                        </p>
                    </div>

                    {/* Tombol Laporan Admin (Hanya jika Admin) */}
                    {user.role === 'admin' && (
                        <div className="col-span-2">
                            <button
                                onClick={() => navigate('/reports')}
                                className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 transform hover:scale-105"
                            >
                                📊 LIHAT LAPORAN LENGKAP ADMIN
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default DashboardPage;