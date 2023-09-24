// #####################################################################    VERIFY TOKEN SIDE  ######################################################################################
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    } else {
        const token = authHeader.substring('Bearer '.length);

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token is expired or invalid' });
            }

            // Store decoded user data in the request
            req.user = decoded;
            next();
        });
    }
};

module.exports = {verifyToken};