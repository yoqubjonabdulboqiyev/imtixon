require("dotenv").config();

const { env } = process;

const config = {
    port: env.PORT,
    mongoURI: env.MONGODB_URI,
    jwtKey: env.JWT_KEY
}

module.exports = config;