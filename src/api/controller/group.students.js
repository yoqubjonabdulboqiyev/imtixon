const { Types } = require("mongoose");
const Groups = require("../../models/group");
const CustomError = require("../../utils/custom.error");
const GroupValidate = require("../../validation/groups");
const Students = require("../../models/student");
const GroupStudents = require("../../models/group.student");
const ObjectId = require("mongoose").Types.ObjectId;


const create = async (req, res, next) => {
    try {
        console.log(new Date())
        const { studentId, groupId } = req.body;
        if (!ObjectId.isValid(studentId) && !ObjectId.isValid(groupId)) {
            throw new CustomError(400, "Invalid id");
        }
        const student = await Students.findOne({ _id: studentId });
        if (!student) {
            throw new CustomError(400, "Student not found");
        };
        const group = await Groups.findOne({ _id: groupId });
        if (!group) {
            throw new CustomError(400, "Group not found");
        };
        const studentGroup = await GroupStudents.findOne({ studentId: studentId, groupId: groupId });
        if (studentGroup) {
            throw new CustomError(400, "Studeent already exists");
        };
        await GroupStudents.create({ groupId: groupId, studentId: studentId });
        res.status(200).json({ message: "Group created" });
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const id = req.params._id;
        if (!ObjectId.isValid(id)) {
            throw new CustomError(400, "Invalid id");
        }
        await GroupStudents.deleteOne({ _id: id })
        res.status(200).json({ message: "Student deleted" });
    } catch (error) {
        next(error);
    }
};

const getAllForAdmin = async (req, res, next) => {
    try {
        const groups = await GroupStudents.aggregate([
            {
                $lookup: {
                    from: "students",
                    foreignField: "_id",
                    localField: "studentId",
                    as: "student"
                }
            },
            {
                $unwind: {
                    path: "$student",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    student: 1,
                }
            }
        ]);
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
}


const getAllForStudent = async (req, res, next) => {
    try {
        const id = req.params._id;
        const groups = await GroupStudents.aggregate([
            {
                $match: {
                    studentId: new Types.ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "groups",
                    foreignField: "_id",
                    localField: "groupId",
                    as: "group"
                }
            },
            {
                $unwind: {
                    path: "$group",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    group: 1,
                }
            }
        ]);
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    create,
    remove,
    getAllForAdmin,
    getAllForStudent
};