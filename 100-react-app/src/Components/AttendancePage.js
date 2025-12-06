// src/components/PresensiPage.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from 'react-webcam';
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  // ==============================
  // FOTO / WEBCAM
  // ==============================
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // ==============================
  // GET LOCATION
  // ==============================
  const getLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
        setIsLoading(false);
        setCoords(null);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // ==============================
  // CHECK-IN (BARU – pakai foto + FormData)
  // ==============================
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords || !image) {
      setError("Lokasi & Foto wajib diambil!");
      return;
    }

    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();

      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-in gagal");
    }
  };

  // ==============================
  // CHECK-OUT
  // ==============================
  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-out gagal");
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10">

      {/* LOADING */}
      {isLoading ? (
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-6xl mb-8 text-center">
          <p className="text-xl font-semibold text-blue-600 animate-pulse">
            Memuat Peta & Lokasi...
          </p>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md w-full mb-8 px-8 max-w-6xl">
          <h3 className="text-xl font-semibold mb-2">Lokasi Terdeteksi:</h3>

          {coords ? (
            <div className="my-4 border rounded-lg overflow-hidden">
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={15}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>Lokasi Anda</Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <p className="text-red-600">Lokasi tidak terbaca. Aktifkan GPS.</p>
          )}
        </div>
      )}

      {/* WEBCAM SECTION */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h3 className="text-xl font-semibold mb-3">Ambil Foto Presensi</h3>

        <div className="my-4 border rounded-lg overflow-hidden bg-black">
          {image ? (
            <img src={image} alt="Selfie" className="w-full" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          )}
        </div>

        <div className="mb-4">
          {!image ? (
            <button
              onClick={capture}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
              Foto Ulang 🔄
            </button>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center mt-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Lakukan Presensi</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>

        <button
          onClick={getLocation}
          className="mt-4 text-blue-600 underline text-sm"
        >
          Refresh Lokasi
        </button>
      </div>
    </div>
  );
}

export default AttendancePage;