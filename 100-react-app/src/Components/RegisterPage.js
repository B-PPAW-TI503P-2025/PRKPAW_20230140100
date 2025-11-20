import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa'); // Default role
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Mengirim data register ke backend sesuai modul
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: username, // Sesuai instruksi "Nama"
        email: email,
        password: password,
        role: role          // Sesuai instruksi "Role"
      });

      // Jika sukses, arahkan ke halaman login
      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
          Daftar Akun
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama anda"
            />
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="name@example.com"
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Input Role (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Tombol Register */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition duration-200"
          >
            Register
          </button>
        </form>

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 text-center rounded border border-red-300 text-sm">
            {error}
          </div>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login disini</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;