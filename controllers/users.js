const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});

const getAllUsers = (req, res) => {
    pool
      .query("SELECT * FROM users;")
      .then((data) => {
        console.log(data);
        res.json(data.rows);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
};

const getUserById = (req, res) => {
    const id = req.params.id;
    pool
      .query("SELECT * FROM users WHERE userid=$1;", [id])
      .then((data) => {
        //   console.log(data);
        if (data.rowCount === 0) {
          res.status(404).json({ message: "User not found" });
        }
        res.json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
};

const createUser = (req, res) => {
    const { firstname, lastname, email, username, phone } =
      req.body; // form data from body
    pool
      .query(
        "INSERT INTO users (firstname ,lastname, email,	username, phone) VALUES ($1,$2,$3,$4,$5) RETURNING *;",
        [firstname ,lastname, email, username, phone]
      )
      .then((data) => {
        console.log(data);
        res.status(201).json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };

const updateUser = (req, res) => {
    const id = req.params.id;
    const {firstname ,lastname, email, username, phone } =
      req.body; // form data from body
    pool
      .query(
        "UPDATE users SET firstname=$1,lastname=$2,email=$3 ,username=$4,phone=$5 WHERE userid=$6 RETURNING *;",
        [firstname ,lastname, email, username, phone, id]
      )
      .then((data) => {
        console.log(data);
        res.status(201).json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };


const deleteUser = (req, res) => {
    const id = Number(req.params.id);
    pool
      .query("DELETE FROM users WHERE userid=$1 RETURNING *;", [id])
      .then((data) => {
        console.log(data);
        res.json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};