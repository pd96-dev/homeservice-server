const jwt = require("jsonwebtoken");
require('dotenv').config();


function jwtGenerator(userid) {
    const payLoad = {
        user: userid
    }

    return jwt.sign(payLoad, process.env.jwtSecret, {expiresIn: "3hr"})
}

module.exports = jwtGenerator

