const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization");


//register 

router.post("/register", validInfo, async (req, res) => {
    try {

        // 1 destructure the req.body (role, email, password)
        const { email, password, confirmPass } = req.body;
        // 2 Check if exists

        if (password !== confirmPass) {
          return res.status(401).json("Passwords do not match!");
        }

        const user = await pool.query("SELECT * FROM serviceprovider WHERE email =  $1", [email]);

        // 3 Bcrypt password


        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists!");
        }
      
          const salt = await bcrypt.genSalt(10);
          const bcryptPassword = await bcrypt.hash(password, salt);

        // 4 Enter the user inside the database

        const newUser = await pool.query("INSERT INTO serviceprovider (email, password) VALUES ($1, $2) RETURNING *", [email, bcryptPassword]) ;

        // 5 Generating JWT token

        const jwtToken = jwtGenerator(newUser.rows[0].userid);

        const userId = newUser.rows[0].userid;

        return res.json({ jwtToken, userId });

      } catch (error) {

        res.status(500).json({ message: error.message })
      }
    });

// Login Route

router.post("/login", validInfo, async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM serviceprovider WHERE email = $1", [
        email
      ]);
  
      if (user.rows.length === 0) {
        return res.status(401).json("Invalid Credential");
      }
  
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );
  
      if (!validPassword) {
        return res.status(401).json("Invalid Credential");
      }

      const userId = user.rows[0].userid;

      const jwtToken = jwtGenerator(user.rows[0].userid);

      return res.json({ jwtToken, userId });

    } catch (error) {

      res.status(500).json({ message: error.message })
    }
  });

router.get("/isverify", authorization, async (req,res) => {

    try {

        res.json(true);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;