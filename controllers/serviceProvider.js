const cloudinary = require("cloudinary").v2;
const pool = require("../db");
const path = require("path");
const fs = require("fs");

const getAllServiceProviders = (req, res) => {
  pool
    .query("SELECT * FROM serviceprovider;")
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getServiceproviderById = (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM serviceprovider WHERE categoryid=$1;", [id])
    .then((data) => {
      //   console.log(data);
      if (data.rowCount === 0) {
        res.status(404).json({ message: "serviceprovider not found" });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const createServiceprovider = async (req, res) => {
  const { buffer, originalname } = req.file;
  const {
    firstname,
    lastname,
    email,
    username,
    phone,
    city,
    categoryid,
    description,
  } = req.body; // form data from body

  // Upload image to Cloudinary and get secure_url
  // Convert the buffer to a file path string
  const filePath = path.join(__dirname, "/../uploads", originalname);
  fs.writeFileSync(filePath, buffer);

  // Upload the file to Cloudinary
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: originalname,
  });

  // Delete the local file after uploading to Cloudinary
  fs.unlinkSync(filePath);

  // get secure_url to be stored in postgraysql database
  const image = result.secure_url;

  pool
    .query(
      "INSERT INTO serviceprovider (firstname ,lastname, email,	username, phone , city, image, categoryid, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;",
      [
        firstname,
        lastname,
        email,
        username,
        phone,
        city,
        image,
        categoryid,
        description,
      ]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const updateServiceprovider = (req, res) => {
  const id = req.params.id;
  const {
    firstname,
    lastname,
    email,
    username,
    phone,
    city,
    image,
    categoryid,
    description,
  } = req.body; // form data from body
  pool
    .query(
      "UPDATE serviceprovider SET firstname=$1, lastname=$2, email=$3, username=$4, phone=$5, city=$6, image=$7, categoryid=$8, description=$9 WHERE serviceproviderid=$10 RETURNING *;",
      [
        firstname,
        lastname,
        email,
        username,
        phone,
        city,
        image,
        categoryid,
        description,
        id,
      ]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const deleteServiceprovider = (req, res) => {
  const id = Number(req.params.id);
  pool
    .query(
      "DELETE FROM serviceprovider WHERE serviceproviderid=$1 RETURNING *;",
      [id]
    )
    .then((data) => {
      console.log(data);
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

module.exports = {
  getAllServiceProviders,
  getServiceproviderById,
  createServiceprovider,
  updateServiceprovider,
  deleteServiceprovider,
};
