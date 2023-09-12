const Joi = require("joi");

class StudentValidate {
    static create({ fullName, phoneNumber, password }) {
        const phoneNumberRegex = /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/;
        const { error } = Joi.object({
            fullName: Joi.string().trim().required(),
            phoneNumber: Joi.string().regex(phoneNumberRegex).required(),
            password: Joi.string().trim().min(6).max(10).required(),
        }).validate({ fullName, phoneNumber, password });

        if (error) {
            return error;
        } else {
            return false;
        }
    }
    static update({ fullName, phoneNumber, password }) {
        const phoneNumberRegex = /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/;
        const { error } = Joi.object({
            fullName: Joi.string().trim().required(),
            phoneNumber: Joi.string().regex(phoneNumberRegex).required(),
            password: Joi.string().trim().min(6).max(10),
        }).validate({ fullName, phoneNumber, password });
        if (error) {
            return error;
        } else {
            return false;
        }
    }
}

module.exports = StudentValidate;
