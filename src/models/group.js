const { model, Schema } = require("mongoose")



const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admins',
        required: true
    }
})

const Groups = model('Groups', schema);

module.exports = Groups;