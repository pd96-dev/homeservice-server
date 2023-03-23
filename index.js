const express = require("express");
const bodyParser = require('body-parser')
const dotenv = require("dotenv");
dotenv.config();

// DATABASE
const app = express();
const PORT = process.env.PORT || 8000;
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});
const cors = require("cors");
const usersRouter = require('./routes/routeUsers')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(express.json());
app.use(cors());

app.use("/api/users", usersRouter);


// TEST index
app.get('/', (request, response) => {
    response.json({
        info: 'Node.js, Express, and Postgres API'
    })
})






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