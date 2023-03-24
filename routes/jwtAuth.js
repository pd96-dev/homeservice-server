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

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4 Enter the user inside the database

        const newUser = await pool.query("INSERT INTO users (role, email, password) VALUES ($1, $2, $3) RETURNING *", [role, email, bcryptPassword]) ;

        // 5 Generating JWT token

        const token = jwtGenerator(newUser.rows[0].userid);

        res.json({ token });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server Error");
    }

});

// Login Route

router.post("/login", validInfo, async (req,res) => {
    try {

        //1 destructure the req.body

        const {email, password} = req.body;

        //2 check if user doesn't exists (if not error)

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])

        if (user.rows[0].length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }

        //3 check if incomming password is the same as database

        const validPassword =  await bcrypt.compare(password, user.rows[0].password);

        if(!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }
        
        //4 giv the jwt token

        const token = jwtGenerator(user.rows[0].userid);

        res.json({token});

    } catch (error) {
        console.log(error.message);
        res.status(500).send("server Error"); 
    }
});


router.get("/isverify", authorization, async (req,res) => {
    console.log("whaaatt!");
    try {

        res.json(true);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server Error"); 
    }
})

module.exports = router;