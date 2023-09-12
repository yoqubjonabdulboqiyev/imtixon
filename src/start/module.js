const fileUpload = require("express-fileupload");
const routers = require("../api/router");
const errorHandler = require("../middleware/error.handler");

const modules = (app, express) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload())
    app.use("/api", routers);

    app.use(errorHandler);

}

module.exports = modules;