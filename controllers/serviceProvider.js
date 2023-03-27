const pool = require("../db");

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
    .query("SELECT * FROM serviceprovider WHERE serviceproviderid=$1;", [id])
    .then((data) => {
      //   console.log(data);
      if (data.rowCount === 0) {
        res.status(404).json({ message: "serviceprovider not found" });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const createServiceprovider = (req, res) => {
  const { firstname, lastname, email, username, phone, city } = req.body; // form data from body
  pool
    .query(
      "INSERT INTO serviceprovider (firstname ,lastname, email,	username, phone , city) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;",
      [firstname, lastname, email, username, phone, city]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const updateServiceprovider = (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, email, username, phone, city } = req.body; // form data from body
  pool
    .query(
      "UPDATE serviceprovider SET firstname=$1,lastname=$2,email=$3 ,username=$4,phone=$5, city=$6 WHERE serviceproviderid=$7 RETURNING *;",
      [firstname, lastname, email, username, phone, city, id]
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
