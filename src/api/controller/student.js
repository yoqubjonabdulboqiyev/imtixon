const { Types } = require("mongoose");
const Students = require("../../models/student");
const CustomError = require("../../utils/custom.error");
const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");
const StudentValidate = require("../../validation/student");
const AdminValidate = require("../../validation/admin");
const { signToken } = require("../../utils/jwt");


const create = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, password } = req.body;
        const photoUrl = req.file;
        const error = await StudentValidate.create({ fullName, phoneNumber, password });
        if (error) {
            throw new CustomError(400, error.message);
        };
        const findStudent = await Students.findOne({ phoneNumber: phoneNumber });
        if (findStudent) {
            throw new CustomError(400, "Phone number already exists");
        };
        const newPassword = await bcrypt.hash(password, 12)
        const student = await Students.create({ fullName: fullName, phoneNumber: phoneNumber, password: newPassword, photoUrl: photoUrl });
        res.status(201).json({ student });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const { fullName, phoneNumber } = req.body;
        let { password } = req.body;
        const id = req.params._id;
        let photoUrl = req.file;
        const error = await StudentValidate.update({ fullName, phoneNumber, password });
        if (error) {
            throw new CustomError(400, error.message);
        };
        if (!ObjectId.isValid(id)) {
            throw new CustomError(400, "Invalid id");
        }
        let findStudent = await Students.findById({ _id: id });
        if (!findStudent) {
            throw new CustomError(400, "Student not found");
        };
        let findStudentPhonenumber = await Students.findOne({ phoneNumber: phoneNumber });

        if (findStudentPhonenumber && ((findStudent._id).toString() !== (findStudentPhonenumber._id.toString()))) {
            throw new CustomError(400, "Student phonenumber already exists");
        }

        if (password) {
            password = await bcrypt.hash(password, 12);
        }
        photoUrl ? photoUrl : findStudent.photoUrl;
        await Students.updateOne({ _id: id }, { fullName: fullName, phoneNumber: phoneNumber, password: password, photoUrl: findStudent.photoUrl });
        res.status(201).json({ message: "Student updated" });
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
        let findStudent = await Students.findById({ _id: id });
        if (!findStudent) {
            throw new CustomError(400, "Student not found");
        };
        await Students.deleteOne({ _id: id });
        res.status(200).json({ message: "Student deleted" });
    } catch (error) {
        next(error);
    }
};

const getAllForAdmin = async (req, res, next) => {
    try {
        const students = await Students.aggregate([
            {
                $project: {
                    _id: 1,
                    fullName: 1,
                    phoneNumber: 1,
                    photoUrl: 1,
                    superStudent: 1
                }
            }
        ])
        res.status(200).json(students);
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
        const findStudent = await Students.aggregate([
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
                    superStudent: 1
                }
            }
        ]);
        if (!findStudent) {
            throw new CustomError(400, "Student not found");
        };
        res.status(200).json(findStudent[0]);
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
        const findStudent = await Students.findOne({ phoneNumber: phoneNumber });
        if (!findStudent) {
            throw new CustomError(404, "Invalid phone number");
        }
        const compare = await bcrypt.compare(password, findStudent.password);
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
    getAllForAdmin,
    login
};