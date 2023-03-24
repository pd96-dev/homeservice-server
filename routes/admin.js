const router = require("express").Router();
const pool = require("../db")
const authorization = require("../middleware/authorization");


router.get("/", authorization, async (req, res) => {
    try {

        const user = await pool.query("SELECT email, firstname, lastname, phone, username, role FROM users WHERE userid = $1", [req.user]);

        res.json(user.rows[0]);
        
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
});

module.exports = router;