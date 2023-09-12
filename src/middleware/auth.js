const config = require("../../config");
const { verifyToken } = require("../utils/jwt");



const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
    try {
        const decoded = verifyToken(token, config.jwtKey);
        req.decoded = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}


module.exports = auth;