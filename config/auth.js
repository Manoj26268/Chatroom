const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            // No token is present and the user is not verified
            return res.status(401).json({ msg: 'No token , Authorization denied' });
        }

        // verify token

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;

        next();
    }
    catch (err) {
        throw new Error(err);
    }
}

module.exports= auth;