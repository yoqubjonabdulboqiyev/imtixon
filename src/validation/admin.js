const Joi = require("joi");

class AdminValidate {
    static create({ fullName, phoneNumber, password, superAdmin }) {
        const phoneNumberRegex = /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/;
        const { error } = Joi.object({
            fullName: Joi.string().trim().required(),
            phoneNumber: Joi.string().regex(phoneNumberRegex).required(),
            password: Joi.string().trim().min(6).max(10).required(),
            superAdmin: Joi.boolean()
        }).validate({ fullName, phoneNumber, password, superAdmin });

        if (error) {
            return error;
        } else {
            return false;
        }
    }
    static update({ fullName, phoneNumber, password, superAdmin }) {
        const phoneNumberRegex = /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/;
        const { error } = Joi.object({
            fullName: Joi.string().trim().required(),
            phoneNumber: Joi.string().regex(phoneNumberRegex).required(),
            password: Joi.string().trim().min(6).max(10),
            superAdmin: Joi.boolean()
        }).validate({ fullName, phoneNumber, password, superAdmin });

        if (error) {
            return error;
        } else {
            return false;
        }
    }
    static login({ phoneNumber, password }) {
        const phoneNumberRegex = /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/;
        const { error } = Joi.object({
            phoneNumber: Joi.string().regex(phoneNumberRegex).required(),
            password: Joi.string().trim().min(6).max(10).required(),
        }).validate({ phoneNumber, password });

        if (error) {
            return error;
        } else {
            return false;
        }
    }
}

module.exports = AdminValidate;
