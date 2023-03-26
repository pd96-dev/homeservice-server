const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization");

router.post("/:id",  async (req, res) => {
    const id = req.params.id;
    try {
        console.log(req.user)

        const user = await pool.query("SELECT email, firstname, lastname, phone, username, role FROM users WHERE userid = $1", [id]);

        res.json(user.rows[0]);
        
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
});

module.exports = router;