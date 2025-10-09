import React, { useState } from 'react';

function App() {
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');

  const kirimNamaKeServer = async () => {
    try {
      const response = await fetch('http://localhost:5000/hello', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nama }),
      });
      const data = await response.json();
      setPesan(data.message);
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Praktikum 1 - React dan Node.js</h1>
      <input
        type="text"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Masukkan nama Anda"
        style={{ padding: '10px', fontSize: '16px' }}
      />
      <br />
      <button
        onClick={kirimNamaKeServer}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Kirim ke Server
      </button>

      {pesan && (
        <h2 style={{ marginTop: '30px', color: 'green' }}>{pesan}</h2>
      )}
    </div>
  );
}

export default App;
