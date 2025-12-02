const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const morgan = require('morgan');
require("dotenv").config();


const db = require('./models'); 

const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.get("/", (req, res) => {
  res.send("Home Page for API");
});
const ruteBuku = require("./routes/books");
app.use("/api/books", ruteBuku);


app.use("/api/reports", reportRoutes); 

app.use("/api/presensi", presensiRoutes);
app.use("/api/auth", authRoutes);


db.sequelize.sync({})
    .then(() => {
        console.log('Database synced. All tables created/recreated.');
        app.listen(PORT, () => {
            console.log(`Express server running at http://localhost:${PORT}/`);
        });
    })
    .catch(err => {
        console.error('Database sync failed:', err);
    });