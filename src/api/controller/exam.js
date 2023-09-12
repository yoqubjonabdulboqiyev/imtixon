const { Types } = require("mongoose");
const Groups = require("../../models/group");
const Exams = require("../../models/exam");
const CustomError = require("../../utils/custom.error");
const ExamValidate = require("../../validation/exam");
const moment = require("moment");
const ObjectId = require("mongoose").Types.ObjectId;


const create = async (req, res, next) => {
    try {
        const { name, finishDate, shootingBall, groupId } = req.body;
        const fileUrl = req.file;
        const error = await ExamValidate.createAndUpdate({ name: name, finishDate: finishDate, shootingBall: shootingBall, fileUrl: fileUrl });
        if (error) {
            throw new CustomError(400, error.message);
        };
        if (!ObjectId.isValid(groupId)) {
            throw new CustomError(400, "Invalid id");
        }
        const group = await Groups.findOne({ _id: groupId });
        if (!group) {
            throw new CustomError(400, "Group not found");
        };
        const exam = await Exams.findOne({ name: name });
        if (exam) {
            throw new CustomError(400, "Exam already exists");
        }
        await Exams.create({ name: name, finishDate: moment(finishDate).unix(), shootingBall: shootingBall, fileUrl: fileUrl, groupId: groupId });

        res.status(200).json({ message: "Exam created" });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const { name, finishDate, shootingBall, groupId } = req.body;
        let { fileUrl } = req.body;
        const examId = req.params._id;
        if (!fileUrl) {
            fileUrl = req.file;
        }
        const error = await ExamValidate.createAndUpdate({ name, finishDate, shootingBall, fileUrl })
        if (error) {
            throw new CustomError(400, error.message)
        };
        if (!ObjectId.isValid(groupId) || !ObjectId.isValid(examId)) {
            throw new CustomError(400, "Invalid id");
        }
        const group = await Groups.findById({ _id: groupId });
        if (!group) {
            throw new CustomError(400, "Group not found");
        };
        const exam = await Exams.findById({ _id: examId });
        if (!exam) {
            throw new CustomError(400, "Exam not found");
        }
        const findExamName = await Exams.findOne({ name: name });

        if (findExamName && (findExamName.name == exam.name) && ((findExamName._id).toString() != exam._id.toString())) {
            throw new CustomError(400, "Exam name already exists");
        }
        await Exams.updateOne({ _id: examId }, { name: name, finishDate: moment().unix(finishDate), shootingBall: shootingBall, fileUrl: fileUrl, groupId: groupId });
        res.status(200).json({ message: "Exam updated" });
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const examId = req.params._id;
        if (!ObjectId.isValid(examId)) {
            throw new CustomError(400, "Invalid id");
        }
        await Exams.deleteOne({ _id: examId })
        res.status(200).json({ message: "Exam deleted" });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const examId = req.params._id;
        if (!ObjectId.isValid(examId)) {
            throw new CustomError(400, "Invalid id");
        }
        const exam = await Exams.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(examId)
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
                    name: 1,
                    fileUrl: 1,
                    finishDate: 1,
                    shootingBall: 1,
                    group: {
                        _id: 1,
                        name: 1
                    }
                }
            }
        ]);
        if (!exam) {
            throw new CustomError(400, "Exam not found");
        }
        res.status(200).json(exam);
    } catch (error) {
        next(error);
    }
}
const getAllForAdmin = async (req, res, next) => {
    try {
        const groupId = req.params._id;
        if (!ObjectId.isValid(groupId)) {
            throw new CustomError(400, "Invalid id");
        }
        const exams = await Exams.aggregate([
            {
                $match: {
                    groupId: new Types.ObjectId(groupId)
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    fileUrl: 1,
                    finishDate: 1,
                    shootingBall: 1,
                    groupId: 1
                }
            }
        ]);

        res.status(200).json(exams);

    } catch (error) {
        next(error);
    };
};



module.exports = {
    create,
    update,
    remove,
    getById,
    getAllForAdmin
};
