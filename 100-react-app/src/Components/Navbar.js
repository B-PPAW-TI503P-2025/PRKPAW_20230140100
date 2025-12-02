import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

function Navbar() { 
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setUser(null);
    navigate('/login'); 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            handleLogout();
        } else {
            setUser(decoded); 
        }
      } catch (e) {
        handleLogout();
      }
    } else {
        setUser(null);
    }
  }, [navigate]);

 if (!user) {
    return null; 
  }

  return (
    <nav className="p-4 bg-gray-900 text-white shadow-lg sticky top-0 z-50"> 
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="font-extrabold text-2xl text-indigo-400 tracking-wider">
          SISTEM PRESENSI
        </div>
        <div className="flex space-x-6 items-center">
          
          <Link to="/dashboard" className="text-gray-300 hover:text-indigo-300 transition duration-200">
            Dashboard
          </Link>
          <Link to="/presensi" className="text-gray-300 hover:text-indigo-300 transition duration-200">
            Presensi
          </Link>
          
          {user.role === 'admin' && (
            <Link to="/reports" className="px-3 py-1 bg-yellow-600 rounded-full text-white font-semibold shadow-md hover:bg-yellow-500 transition duration-200 text-sm">
              Laporan Admin
            </Link>
          )}

          <span className="text-sm text-indigo-300 font-medium ml-4">
            👤 {user.nama || user.email}
          </span>
          
          <button
            onClick={handleLogout}
            className="py-1.5 px-4 bg-red-700 rounded-lg text-white font-semibold shadow-md hover:bg-red-600 transition duration-200 text-sm"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;