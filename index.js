const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("<h1>My Home Services APP</h1>");
});

app.get("/api/users", (req, res) => {
    pool
      .query("SELECT * FROM users;")
      .then((data) => {
        console.log(data);
        res.json(data.rows);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  });

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));