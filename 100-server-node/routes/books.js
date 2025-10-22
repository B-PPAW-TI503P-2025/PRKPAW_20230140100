const express = require("express");
const router = express.Router();

// Contoh endpoint
router.get("/", (req, res) => {
  res.json({ message: "Books route OK" });
});

module.exports = router; 
