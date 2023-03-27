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
        const { role, email, password } = req.body;
        // 2 Check if exists
        const user = await pool.query("SELECT * FROM users WHERE email =  $1", [email]);

        if(user.rows.length !== 0) {
            res.status(401).send("User already Exists")
        }
        // 3 Bcrypt password


        if (user.rows.length > 0) {
            return res.status(401).json("User already exist!");
          }
      
          const salt = await bcrypt.genSalt(10);
          const bcryptPassword = await bcrypt.hash(password, salt);

        // 4 Enter the user inside the database

        const newUser = await pool.query("INSERT INTO users (role, email, password) VALUES ($1, $2, $3) RETURNING *", [role, email, bcryptPassword]) ;

        // 5 Generating JWT token

        const jwtToken = jwtGenerator(newUser.rows[0].userid);
        const userId = user.rows[0].userid;
        return res.json({ jwtToken, userId });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    });

// Login Route

router.post("/login", validInfo, async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
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
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

router.get("/isverify", authorization, async (req,res) => {

    try {

        res.json(true);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server Error"); 
    }
})

module.exports = router;