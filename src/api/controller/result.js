const { Types } = require("mongoose");
const CustomError = require("../../utils/custom.error");
const Students = require("../../models/student");
const Exams = require("../../models/exam");
const Results = require("../../models/result");
const ResultValidate = require("../../validation/result");
const moment = require("moment");
const ObjectId = require("mongoose").Types.ObjectId;


const create = async (req, res, next) => {
    try {
        const { studentId, examId } = req.body;
        const fileUrl = req.file;
        const error = await ResultValidate.create({ fileUrl: fileUrl })
        if (error) {
            throw new CustomError(400, error.message)
        };
        if (!ObjectId.isValid(studentId) && !ObjectId.isValid(examId)) {
            throw new CustomError(400, "Invalid id");
        }
        const student = await Students.findById({ _id: studentId });
        if (!student) {
            throw new CustomError(400, "Student not found");
        };
        const exam = await Exams.findById({ _id: examId });
        if (!exam) {
            throw new CustomError(400, "exam not found");
        }
        const studentResult = await Results.findOne({ studentId: studentId, examId: examId });
        if (studentResult) {
            throw new CustomError(400, "Result already exists");
        }
        await Results.create({ finishDate: moment(new Date()).unix(), studentId: studentId, examId: examId, fileUrl: fileUrl });
        res.status(200).json({ message: "Result created" });
    } catch (error) {
        next(error);
    }
}

const updateForAdmin = async (req, res, next) => {
    try {

        const { ball } = req.body;
        const resultId = req.params._id;
        const error = await ResultValidate.update({ ball: ball })
        if (error) {
            throw new CustomError(400, error.message)
        };
        if (!ObjectId.isValid(resultId)) {
            throw new CustomError(400, "Invalid id");
        }
        const result = await Results.findById({ _id: resultId });
        if (!result) {
            throw new CustomError(400, "Result not found");
        };
        const exam = await Exams.findById({ _id: result.examId });
        if (((result.finishDate > exam.finishDate) && (ball - Math.floor((result.finishDate - exam.finishDate) / 60 / 5)) < 1) || (ball - Math.floor((result.finishDate - exam.finishDate)/60 / 5)) < exam.shootingBall) {
            return res.status(201).json({ message: "success" });
        };

        await Results.updateOne({ _id: resultId }, { ball: (ball - Math.floor((result.finishDate - exam.finishDate)/60 / 5)), status: "success" });
        res.status(200).json({ message: "Success" });
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const resultId = req.params._id;
        if (!ObjectId.isValid(resultId)) {
            throw new CustomError(400, "Invalid id");
        }
        await Results.deleteOne({ _id: resultId })
        res.status(200).json({ message: "Result deleted" });
    } catch (error) {
        next(error);
    }
};

const getAllForAdmin = async (req, res, next) => {
    try {
        const examId = req.params._id;
        if (!ObjectId.isValid(examId)) {
            throw new CustomError(400, "Invalid id");
        }
        const results = await Results.aggregate([
            {
                $match: {
                    examId: new Types.ObjectId(examId)
                }
            },
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
                    finishDate: 1,
                    fileUrl: 1,
                    ball: 1,
                    status: 1,
                    examId: 1,
                    student: 1,
                }
            }
        ]);
        res.status(200).json({ results });
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const resultId = req.params._id;
        if (!ObjectId.isValid(resultId)) {
            throw new CustomError(400, "Invalid id");
        }
        const result = await Results.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(resultId)
                }
            },
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
                    finishDate: 1,
                    fileUrl: 1,
                    ball: 1,
                    status: 1,
                    examId: 1,
                    student: 1,
                }
            }
        ]);
        if (!result) {
            throw new CustomError(400, error.message);
        }
        res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}



const getByIdForStudent = async (req, res, next) => {
    try {
        const { examId, studentId } = req.query;
        const result = await Results.aggregate([
            {
                $match: {
                    examId: new Types.ObjectId(examId),
                    studentId: new Types.ObjectId(studentId)
                }
            },
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
                    finishDate: 1,
                    fileUrl: 1,
                    ball: 1,
                    status: 1,
                    examId: 1,
                    student: 1,
                }
            }
        ]);
        if (!result) {
            throw new CustomError(400, error.message);
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    updateForAdmin,
    remove,
    getById,
    getAllForAdmin,
    getByIdForStudent
};