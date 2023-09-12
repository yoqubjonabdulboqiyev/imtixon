const { connect } = require("mongoose");
const config = require("../../config");

const start = async (app) => {
    await connect(config.mongoURI)
    app.listen(config.port, () => {
        console.log('Server is running on port 3000');
    });
}

module.exports = start;