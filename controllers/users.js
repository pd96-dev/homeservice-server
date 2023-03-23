// getAllUsers,
// getUsersPaginated,
// getUserById,
// searchUsers,
// createUser,
// updateUser,
// deleteUser,
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

module.exports = {
    getAllUsers,
};