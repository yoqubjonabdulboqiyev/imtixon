const Joi = require("joi");

class GroupValidate {
    static create({ name }) {
        const { error } = Joi.object({
            name: Joi.string().trim().required()
        }).validate({ name });
        if (error) {
            return error;
        } else {
            return false;
        }
    }
}

module.exports = GroupValidate;
