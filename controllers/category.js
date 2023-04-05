const pool = require("../db");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

// Upload an image to Cloudinary and save the secure_url, Altdescription, and associated propertyid to PostgreSQL database
const uploadCategoryImage = async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const { category, description } = req.body;

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
      "INSERT INTO categories (category,	categorydescription,	categoryimage) VALUES ($1, $2, $3);";
    const values = [category, description, image];
    await pool.query(query, values);
    console.log(
      `Uploaded image to cloudinary: ImageName: ${description} \n URL: ${image} `
    );
    res.json({ category, description, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

const getAllCategories = (req, res) => {
  pool
    .query("SELECT * FROM categories ORDER BY category ASC;")
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getCategoryById = (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM categories WHERE categoryid=$1;", [id])
    .then((data) => {
      //   console.log(data);
      if (data.rowCount === 0) {
        res.status(404).json({ message: "category not found" });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const creatCategory = (req, res) => {
  const { category, description, image } = req.body; // form data from body
  pool
    .query(
      "INSERT INTO categories (category,	categorydescription,	categoryimage) VALUES ($1,$2,$3) RETURNING *;",
      [category, description, image]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const updateCategory = (req, res) => {
  const id = req.params.id;
  const { category, description, image } = req.body; // form data from body
  pool
    .query(
      "UPDATE categories SET category=$1,categorydescription=$2,categoryimage=$3 WHERE categoryid=$4 RETURNING *;",
      [category, description, image, id]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const deleteCategory = (req, res) => {
  const id = Number(req.params.id);
  pool
    .query("DELETE FROM categories WHERE categoryid=$1 RETURNING *;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

module.exports = {
  uploadCategoryImage,
  getAllCategories,
  getCategoryById,
  creatCategory,
  updateCategory,
  deleteCategory,
};
