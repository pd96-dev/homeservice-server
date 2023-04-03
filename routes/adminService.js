const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization");

router.post("/:id", authorization,  async (req, res) => {
    const id = req.params.id;
    try {
        console.log(id)

        const user = await pool.query("SELECT username, firstname, lastname, email, phone, city, image, description, state, country, zipcode, address  FROM serviceprovider WHERE serviceproviderid = $1", [id]);

        res.json(user.rows[0]);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
        
    }
});

module.exports = router;