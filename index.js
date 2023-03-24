const express = require("express");
const bodyParser = require('body-parser')
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DATABASE
const PORT = process.env.PORT || 8000;
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});
const cors = require("cors");
const usersRouter = require('./routes/routeUsers')
const propertyRouter = require('./routes/routeProperty')

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/property", propertyRouter);

// TEST index
app.get("/", (request, response) => {
  response.json({
    info: "Node.js, Express, and Postgres API",
  });
});

// app.get("/api/users", (req, res) => {
//     pool
//       .query("SELECT * FROM users;")
//       .then((data) => {
//         console.log(data);
//         res.json(data.rows);
//       })
//       .catch((e) => res.status(500).json({ message: e.message }));
//   });

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));
