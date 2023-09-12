const { Types } = require("mongoose");
const Admins = require("../../models/admin");
const Groups = require("../../models/group");
const CustomError = require("../../utils/custom.error");
const GroupValidate = require("../../validation/groups");
const ObjectId = require("mongoose").Types.ObjectId;


const create = async (req, res, next) => {
    try {
        const { name, adminId } = req.body;
        const error = await GroupValidate.create({ name: name })
        if (error) {
            throw new CustomError(400, error.message)
        };
        if (!ObjectId.isValid(adminId)) {
            throw new CustomError(400, "Invalid id");
        }
        const admin = await Admins.findOne({ _id: adminId });
        if (!admin) {
            throw new CustomError(400, "Admin not found");
        };
        const group = await Groups.findOne({ name: name });
        if (group) {
            throw new CustomError(400, "Group already exists");
        }
        await Groups.create({ name: name, adminId: adminId });
        res.status(200).json({ message: "Group created" });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const { name, adminId } = req.body;
        const groupId = req.params._id;
        const error = await GroupValidate.create({ name: name })
        if (error) {
            throw new CustomError(400, error.message)
        };
        if (!ObjectId.isValid(adminId)) {
            throw new CustomError(400, "Invalid id");
        }
        const admin = await Admins.findById({ _id: adminId });
        if (!admin) {
            throw new CustomError(400, "Admin not found");
        };
        const group = await Groups.findById({ _id: groupId });
        if (!group) {
            throw new CustomError(400, "Group not found");
        }
        const findGroupName = await Groups.findOne({ name: name });
        if (findGroupName && (findGroupName.name == group.name) && (findGroupName._id != group.id)) {
            throw new CustomError(400, "Group name already exists");
        }
        await Groups.updateOne({ _id: groupId }, { name: name, adminId: adminId });
        res.status(200).json({ message: "Group updated" });
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const groupId = req.params._id;
        if (!ObjectId.isValid(groupId)) {
            throw new CustomError(400, "Invalid id");
        }
        await Groups.deleteOne({ _id: groupId })
        res.status(200).json({ message: "Group deleted" });
    } catch (error) {
        next(error);
    }
};

const getAllForAdmin = async (req, res, next) => {
    try {
        const groups = await Groups.aggregate([
            {
                $lookup: {
                    from: "admins",
                    foreignField: "_id",
                    localField: "adminId",
                    as: "admin"
                }
            },
            {
                $unwind: {
                    path: "$admin",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    admin: 1,
                    adminId: 1,
                }
            }
        ]);
        res.status(200).json({ groups });
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const groupId = req.params._id;
        const group = await Groups.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(groupId)
                }
            },
            {
                $lookup: {
                    from: "admins",
                    foreignField: "_id",
                    localField: "adminId",
                    as: "admin"
                }
            },
            {
                $unwind: {
                    path: "$admin",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    admin: 1,
                    adminId: 1,
                }
            }
        ]);
        if (!group) {
            throw new CustomError(400, error.message);
        }
        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    update,
    remove,
    getById,
    getAllForAdmin,
};