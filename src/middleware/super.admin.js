const Admins = require("../models/admin");
const CustomError = require("../utils/custom.error");


const isSuperAdmin = async (req, res, next) => {
    try {
        const { admin } = req;
        if (!admin.superAdmin) {
            throw new CustomError(403, "Permission denied")
        }
        next()
    } catch (err) {
        res.status(403).json({ message: err.message });
        next(err);
    }
}
module.exports = isSuperAdmin;