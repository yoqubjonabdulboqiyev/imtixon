const { model, Schema } = require("mongoose")



const schema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    photoUrl: {
        type: String,
        required: true,
        trim: true,
        default: 'https://i.ibb.co/z6z6z6z/default.png'
    }
})

const Students = model('Students', schema);

module.exports = Students;