const { model, Schema } = require("mongoose")


const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fileUrl: {
        type: String,
        required: true,
        trim: true
    },
    finishDate: {
        type: Number,
        required: true,
        min: 1,
    },
    shootingBall: {
        type: Number,
        required: true,
        max: 100,
        min: 0
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Groups',
        required: true
    }
})


const Exams = model('Exams', schema);

module.exports = Exams;