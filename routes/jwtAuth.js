const router = require("express").Router()
const pool = require("../db")
//register 

router.post("/", async (req, res) => {
    try {

        // 1 destructure the req.body (role, email, password)
        const { role, email, password } = req.body;
        // 2 Check if exists
        const user = await pool.query("");
        // 3 Bcrypt password

        // 4 Enter the user inside the database

        // 5 Generating JWT token

        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server Error");
    }

})

module.exports = router;