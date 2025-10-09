// Import library Express dan CORS
const express = require('express');
const cors = require('cors');

// Inisialisasi aplikasi
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Endpoint GET sesuai instruksi tugas
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Server!' });
});

// ✅ Tambahan endpoint POST untuk tugas React agar menerima input nama
app.post('/hello', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Nama belum dikirim.' });
  }
  res.json({ message: `Hello, ${name}!` });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
