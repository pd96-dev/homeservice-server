const cloudinary = require("cloudinary").v2;
const pool = require("../db");
const path = require("path");
const fs = require("fs");

// Upload an image to Cloudinary and save the secure_url, Altdescription, and associated propertyid to PostgreSQL database
const uploadPropertyImage = async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const { altdescription, propertyid } = req.body;

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

    // Save secure_url and title to PostgreSQL database
    const query =
      "INSERT INTO propertyimage (altdescription, image, propertyid) VALUES ($1, $2, $3);";
    const values = [altdescription, image, propertyid];
    await pool.query(query, values);
    console.log(
      `Uploaded image to cloudinary: ImageName: ${altdescription} \n URL: ${image} \n PropertyID: ${propertyid}`
    );
    res.json({ image, altdescription, propertyid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

const getAllPropertyImages = (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM propertyimage WHERE propertyid=$1;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getPropertyImageById = (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM propertyimage WHERE imageid=$1;", [id])
    .then((data) => {
      //   console.log(data);
      if (data.rowCount === 0) {
        res
          .status(404)
          .json({ message: `Property image with ${id} not found` });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const deletePropertyImageById = (req, res) => {
  const id = Number(req.params.id);
  pool
    .query("DELETE FROM propertyimage WHERE imageid=$1 RETURNING *;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

module.exports = {
  uploadPropertyImage,
  getAllPropertyImages,
  getPropertyImageById,
  deletePropertyImageById,
};
