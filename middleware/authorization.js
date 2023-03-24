const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = async(req,res,next) => {
    try {
        
        const jwtToken = req.header("token");

        if(!jwtToken){
            return res.status(403).json("Noth Authorize");
        }


        const payLoad = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payLoad.user;


    } catch (error) {
            console.log(error.message)
            return res.status(403).json("Noth Authorize")
    }
    next();
}