const cloudinary = require("cloudinary").v2;
const pool = require("../db");
const path = require("path");
const fs = require("fs");


const getSearch = (req, res) => {
  const keyword = req.params.keyword;
  const category = req.params.category;
  const city = req.params.city;

  if(category === "all" && city !== "all") {
    pool
    .query(
      "SELECT * FROM serviceprovider INNER JOIN categories ON serviceprovider.categoryid = categories.categoryid WHERE LOWER(firstname) LIKE $1 OR LOWER(lastname) LIKE $1 AND LOWER(city) = $2",
      [`%${keyword}%`, city]
    )
    .then((data) => {

      return res.json(data.rows);
    })
    .catch((e) =>  res.status(500).json({ message: e.message }));
  } else if (category === "all" && city === "all" ) {
    pool
    .query(
      "SELECT * FROM serviceprovider INNER JOIN categories ON serviceprovider.categoryid = categories.categoryid WHERE LOWER(firstname) LIKE $1 OR LOWER(lastname) LIKE $1 OR LOWER(city) LIKE $1 ",
      [`%${keyword}%`]
    )
    .then((data) => {
      return res.json(data.rows);
    })
    }
    else if (city === "all" && category !== "all" ) {
      pool
      .query(
        "SELECT * FROM serviceprovider INNER JOIN categories ON serviceprovider.categoryid = categories.categoryid WHERE LOWER(firstname) LIKE $1 OR LOWER(lastname) LIKE $1 AND serviceprovider.categoryid = $2",
        [`%${keyword}%`, category]
      )
      .then((data) => {
        return res.json(data.rows);
      })
      }
  else {
    pool
      .query(
        "SELECT * FROM serviceprovider INNER JOIN categories ON serviceprovider.categoryid = categories.categoryid WHERE LOWER(firstname) LIKE $1 OR LOWER(lastname) LIKE $1 AND LOWER(city) = $2 AND serviceprovider.categoryid = $3",
        [`%${keyword}%`, city, category]
      )
      .then((data) => {

        return res.json(data.rows);
      })
      .catch((e) =>  res.status(500).json({ message: e.message }));
    }
    };

const getAllServiceProvidersCategory = (req, res) => {
  const id = req.params.id;
  pool
    .query(
      "SELECT * FROM serviceprovider INNER JOIN categories ON serviceprovider.categoryid = categories.categoryid WHERE serviceprovider.categoryid = $1;",
      [id]
    )
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getAllServiceProviders = (req, res) => {
  pool
    .query(
      "SELECT * FROM serviceprovider INNER JOIN categories ON serviceprovider.categoryid = categories.categoryid ;"
    )
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getServiceproviderById = (req, res) => {
  const id = req.params.id;
  pool
    .query(
      "SELECT * FROM serviceprovider INNER JOIN categories ON serviceprovider.categoryid = categories.categoryid WHERE serviceproviderid=$1;",
      [id]
    )
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
    state,
    country,
    zipcode,
    address,
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
      "INSERT INTO serviceprovider (firstname ,lastname, email,	username, phone , city, state,country,zipcode,address,image, categoryid, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *;",
      [
        firstname,
        lastname,
        email,
        username,
        phone,
        city,
        state,
        country,
        zipcode,
        address,
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

const updateServiceprovider = async (req, res) => {
  const serviceproviderid = req.params.id;

  let {
    firstname,
    lastname,
    email,
    username,
    phone,
    city,
    state,
    country,
    zipcode,
    address,
    image,
    categoryid,
    description,
  } = req.body; // form data from body

  // check if the file is present in req --> upload file to cloudinary and update image with the cloudinary image url
  if (req.file) {
    console.log(`Data from client: 
     ${req.file}
     `);
    const { buffer, originalname } = req.file;

    // Upload image to Cloudinary and get secure_url
    // Convert the buffer to a file path string
    const filePath = path.join(__dirname, "/../uploads", originalname);
    fs.writeFileSync(filePath, buffer);

    // Upload the file to Cloudinary

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: originalname,
      resource_type: "auto",
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(filePath);

    // get secure_url to be stored in postgraysql database
    image = result.secure_url;
  } else {
    // If no file was uploaded, use the existing image URL
    image = req.body.image;
  }
  pool
    .query(
      "UPDATE serviceprovider SET firstname=$1, lastname=$2, email=$3, username=$4, phone=$5, city=$6,  state=$7,  country=$8,zipcode=$9, address=$10, image=$11, categoryid=$12, description=$13 WHERE serviceproviderid=$14 RETURNING *;",
      [
        firstname,
        lastname,
        email,
        username,
        phone,
        city,
        state,
        country,
        zipcode,
        address,
        image,
        categoryid,
        description,
        serviceproviderid,
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
  getSearch,
  getAllServiceProvidersCategory,
  getAllServiceProviders,
  getServiceproviderById,
  createServiceprovider,
  updateServiceprovider,
  deleteServiceprovider,
};
