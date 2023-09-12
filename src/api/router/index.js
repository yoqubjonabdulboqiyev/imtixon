const adminRouter = require("./admin");
const examRouter = require("./exam");
const groupRouter = require("./group");
const studentRouter = require("./student");
const studentGroupRouter = require("./groupStudent");
const resultRouter = require("./result");


module.exports = [adminRouter, examRouter, groupRouter, studentRouter, studentGroupRouter, resultRouter];