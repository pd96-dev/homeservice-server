const express = require("express");
const bodyParser = require("body-parser");
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
const cors = require("cors");
const usersRouter = require("./routes/routeUsers");
const propertyRouter = require("./routes/routeProperty");
const propertyImageRouter = require("./routes/routePropertyImage");
const categoryRouter = require("./routes/routeCategory");
const serviceProviderRouter = require("./routes/routeServiceProvider");
const quoteRouter = require("./routes/routeQuote");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors());

//ROUTES

//Register and login
app.use("/api/auth", require("./routes/jwtAuth"));
app.use("/api/users", usersRouter);
app.use("/api/admin", require("./routes/admin"));

app.use("/api/property", propertyRouter);
app.use("/api/propertyImage", propertyImageRouter);
app.use("/api/category", categoryRouter);
app.use("/api/serviceProviders", serviceProviderRouter);
app.use("/api/quotes", quoteRouter);

// TEST index
app.get("/", (request, response) => {
  response.json({
    info: "Node.js, Express, and Postgres API",
  });
});

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));
