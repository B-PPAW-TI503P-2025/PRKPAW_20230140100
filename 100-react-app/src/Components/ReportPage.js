import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Navbar from './Navbar'; 

function ReportPage() { 
  const [reports, setReports] = useState([]); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 1. STATE BARU UNTUK POPUP FOTO
  const [selectedImage, setSelectedImage] = useState(null);

  // URL Backend (Pastikan portnya benar, di kode Anda port 3001)
  const BASE_URL = "http://localhost:3001"; 

  const getToken = () => localStorage.getItem("token");

  const fetchReports = async (query = "", start = "", end = "") => {
    const token = getToken(); 
    if (!token) { 
      navigate("/login"); 
      return; 
    }

    try { 
      const config = { 
        headers: { Authorization: `Bearer ${token}` }, 
        params: { nama: query, startDate: start, endDate: end }
      };

      setError(null); 
      const response = await axios.get(`${BASE_URL}/api/reports/daily`, config);
      setReports(response.data.data); 

    } catch (err) { 
      const message = err.response 
                      ? err.response.data.message || `Gagal mengambil laporan: ${err.response.status}`
                      : "Koneksi ke server gagal. Pastikan server berjalan dan Anda login sebagai admin.";
      setError(message);
      setReports([]); 
      
      if(err.response && err.response.status === 403) {
          setTimeout(() => navigate('/dashboard'), 3000);
      }
    }
  }; 

  useEffect(() => { 
    fetchReports("", '', ''); 
  }, [navigate]); 

  const handleFilterSubmit = (e) => { 
    e.preventDefault(); 
    fetchReports(searchTerm, startDate, endDate); 
  }; 

 return ( 
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg min-h-screen"> 
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 border-b pb-2"> 
        📊 Laporan Presensi Harian Administrator 
      </h1>

      <form onSubmit={handleFilterSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 bg-gray-50 rounded-lg border"> 
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Pegawai</label>
            <input
                type="text"
                placeholder="Masukkan nama..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        <button
          type="submit" 
          className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-200" 
        >
          Tampilkan Laporan
        </button>
      </form> 

      {error && ( 
        <p className="text-red-700 bg-red-100 p-4 rounded-lg mb-6 font-medium border border-red-300">{error}</p> 
      )}

      {!error && ( 
        <div className="bg-white border rounded-lg overflow-x-auto"> 
          <table className="min-w-full divide-y divide-gray-200"> 
            <thead className="bg-gray-800 text-white"> 
              <tr> 
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Check-In</th>
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Check-Out</th>
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Durasi</th>
                {/* 2. KOLOM BARU BUKTI FOTO */}
                <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider text-center">Bukti Foto</th>
              </tr> 
            </thead> 
            <tbody className="bg-white divide-y divide-gray-200"> 
              {reports.length > 0 ? ( 
                reports.map((presensi) => {
                    const checkInTime = new Date(presensi.checkIn);
                    const checkOutTime = presensi.checkOut ? new Date(presensi.checkOut) : null;
                    const durationMs = checkOutTime ? checkOutTime - checkInTime : null;
                    const durationHours = durationMs ? (durationMs / (1000 * 60 * 60)).toFixed(2) : '-';
                    
                    return (
                        <tr key={presensi.id} className="hover:bg-indigo-50 transition duration-100"> 
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"> 
                                {presensi.User ? presensi.User.nama : "N/A"} 
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"> 
                                {checkInTime.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} 
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"> 
                                {checkOutTime
                                    ? checkOutTime.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                                    : <span className="text-red-500 font-semibold">Belum Check-Out</span>} 
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                {durationHours !== '-' ? `${durationHours} jam` : '-'}
                            </td>
                            
                            {/* 3. TAMPILKAN THUMBNAIL FOTO */}
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                {presensi.buktiFoto ? (
                                    <img 
                                        src={`${BASE_URL}/${presensi.buktiFoto}`} 
                                        alt="Bukti"
                                        className="h-12 w-12 object-cover rounded-md cursor-pointer border hover:opacity-80 mx-auto shadow-sm"
                                        onClick={() => setSelectedImage(`${BASE_URL}/${presensi.buktiFoto}`)}
                                    />
                                ) : (
                                    <span className="text-gray-400 text-xs italic">Tidak ada</span>
                                )}
                            </td>
                        </tr>
                    );
                }) 
              ) : (
                <tr> 
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic"> 
                    Tidak ada data presensi yang ditemukan untuk kriteria ini.
                  </td>
                </tr> 
              )}
            </tbody> 
          </table> 
        </div> 
      )}

      {/* 4. MODAL POPUP (Overlay dengan Tailwind) */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={() => setSelectedImage(null)}
        >
            <div className="relative max-w-4xl w-full flex flex-col items-center">
                {/* Tombol Close */}
                <button 
                    className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300 focus:outline-none"
                    onClick={() => setSelectedImage(null)}
                >
                    &times;
                </button>
                
                {/* Gambar Full Size */}
                <img 
                    src={selectedImage} 
                    alt="Full Size" 
                    className="max-h-[90vh] max-w-full rounded-lg shadow-2xl object-contain bg-white"
                />
            </div>
        </div>
      )}

    </div>
    </>
  ); 
}

export default ReportPage;