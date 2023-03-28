const pool = require("../db");

const getAllProperties = (req, res) => {
    const id = req.params.id;
    pool
      .query("SELECT * FROM property WHERE userid=$1;", [id])
      .then((data) => {
        console.log(data);
        res.json(data.rows);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
};

const getPropertyById = (req, res) => {
    const id = req.params.id;
    pool
      .query("SELECT * FROM property WHERE propertyid=$1;", [id])
      .then((data) => {
        //   console.log(data);
        if (data.rowCount === 0) {
          res.status(404).json({ message: "Property not found" });
        }
        res.json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
};

const createProperty = (req, res) => {
    const id = req.params.id;
    const { description, address, city, state, country, userid, zipcode } =
      req.body; // form data from body
    pool
      .query(
        "INSERT INTO property (description, address, city, state, country, userid, zipcode) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;",
        [description, address, city, state, country, userid, zipcode]
      )
      .then((data) => {
        console.log(data);
        res.status(201).json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };

const updateProperty = (req, res) => {
    const id = req.params.id;
    const {description, address, city, state, country, zipcode} =
      req.body; // form data from body
    pool
      .query(
        "UPDATE property SET description=$1, address=$2, city=$3 ,state=$4, country=$5, zipcode=$6 WHERE propertyid=$7 RETURNING *;",
        [description, address, city, state, country, zipcode, id]
      )
      .then((data) => {
        console.log(data);
        res.status(201).json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };


const deleteProperty = (req, res) => {
    const id = Number(req.params.id);
    pool
      .query("DELETE FROM property WHERE propertyid=$1 RETURNING *;", [id])
      .then((data) => {
        console.log(data);
        res.json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };

module.exports = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};