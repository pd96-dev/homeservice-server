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
const propertyRouter = require('./routes/routeProperty')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(express.json());
app.use(cors());

//ROUTES

//Register and login

app.use("/auth", require("./routes/jwtAuth"));

app.use("/api/users", usersRouter);
app.use("/api/property", propertyRouter);


// TEST index
app.get('/', (request, response) => {
    response.json({
        info: 'Node.js, Express, and Postgres API'
    })
})



app.listen(PORT, () => console.log(`server is up on port ${PORT}`));