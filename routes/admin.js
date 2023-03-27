const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization");

router.post("/:id", authorization,  async (req, res) => {
    const id = req.params.id;
    try {
        console.log(id)

        const user = await pool.query("SELECT email, firstname, lastname, phone, username FROM users WHERE userid = $1", [id]);

        res.json(user.rows[0]);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
        
    }
});

module.exports = router;