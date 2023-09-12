const { Types } = require("mongoose");
const Admins = require("../../models/admin");
const CustomError = require("../../utils/custom.error");
const { signToken } = require("../../utils/jwt");
const AdminValidate = require("../../validation/admin");
const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt")

const create = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, password, superAdmin } = req.body;
        const photoUrl = req.file;
        const error = await AdminValidate.create({ fullName, phoneNumber, password, superAdmin });
        if (error) {
            throw new CustomError(400, error.message);
        };
        const findAdmin = await Admins.findOne({ phoneNumber: phoneNumber });
        if (findAdmin) {
            throw new CustomError(400, "Phone number already exists");
        };
        const newPassword = await bcrypt.hash(password, 12)
        const admin = await Admins.create({ fullName: fullName, phoneNumber: phoneNumber, password: newPassword, superAdmin: superAdmin, photoUrl: photoUrl });
        const token = signToken({ phoneNumber: phoneNumber })
        res.status(201).json({ admin, token });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, superAdmin } = req.body;
        const id = req.params._id;
        let { password } = req.body;
        const photoUrl = req.file;
        const error = await AdminValidate.update({ fullName, phoneNumber, password, superAdmin });
        if (error) {
            throw new CustomError(400, error.message);
        };
        if (!ObjectId.isValid(id)) {
            throw new CustomError(400, "Invalid id");
        }
        let findAdmin = await Admins.findById({ _id: id });
        if (!findAdmin) {
            throw new CustomError(400, "Admin not found");
        };
        let findAdminPhonenumber = await Admins.findOne({ phoneNumber: phoneNumber });
        if (findAdminPhonenumber && ((findAdmin._id).toString() !== (findAdminPhonenumber._id).toString())) {
            throw new CustomError(400, "Admin phonenumber already exists");
        }
        if (password) {
            password = await bcrypt.hash(password, 12);
        }
        photoUrl ? photoUrl : findAdmin.photoUrl;
        try {
            await Admins.updateOne({ _id: id }, { fullName: fullName, phoneNumber: phoneNumber, password: password, superAdmin: superAdmin, photoUrl: photoUrl });
        } catch (error) {
            throw new CustomError(400, error.message)
        }
        const token = signToken({ phonenumber: phoneNumber });
        res.status(201).json({ token });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.params._id;
        if (!ObjectId.isValid(id)) {
            throw new CustomError(400, "Invalid id");
        }
        let findAdmin = await Admins.findById({ _id: id });
        if (!findAdmin) {
            throw new CustomError(400, "Admin not found");
        };
        await Admins.deleteOne({ _id: id });
        res.status(200).json({ message: "Admin deleted" });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const admins = await Admins.aggregate([
            {
                $project: {
                    _id: 1,
                    fullName: 1,
                    phoneNumber: 1,
                    photoUrl: 1,
                    superAdmin: 1
                }
            }
        ])
        res.status(200).json(admins);
    } catch (error) {
        next(error);
    }
}
const getById = async (req, res, next) => {
    try {
        const id = req.params._id;
        if (!ObjectId.isValid(id)) {
            throw new CustomError(400, "Invalid id");
        }
        const findAdmin = await Admins.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },
            {
                $project: {
                    _id: 1,
                    fullName: 1,
                    phoneNumber: 1,
                    photoUrl: 1,
                    superAdmin: 1
                }
            }
        ]);
        if (!findAdmin) {
            throw new CustomError(400, "Admin not found");
        };
        res.status(200).json(findAdmin);
    } catch (error) {
        next(error);
    }
}



const login = async (req, res, next) => {
    try {
        const { password, phoneNumber } = req.body;
        const error = await AdminValidate.login({ password, phoneNumber });
        if (error) {
            throw new CustomError(400, error.message);
        }
        const findAdmin = await Admins.findOne({ phoneNumber: phoneNumber });
        if (!findAdmin) {
            throw new CustomError(404, "Invalid phone number");
        }
        const compare = await bcrypt.compare(password, findAdmin.password);
        if (!compare) {
            throw new CustomError(400, "Invalid password");
        }
        const token = signToken({ phoneNumber });
        res.status(201).json({ token });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    update,
    remove,
    getById,
    getAll,
    login,
};