const { sign, verify } = require("jsonwebtoken");
const config = require("../../config");


const signToken = (payload) => sign(payload, config.jwtKey, { expiresIn: "24h" });
const verifyToken = (payload, callback) => verify(payload, config.jwtKey, callback);

module.exports = {
    signToken,
    verifyToken
}