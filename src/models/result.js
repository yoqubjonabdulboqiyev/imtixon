const { Schema, model } = require("mongoose");

const schema = new Schema({
    finishDate: {
        type: Number,
        min: 0,
        required: true
    },
    fileUrl: {
        type: String,
        trim: true,
        required: true
    },
    ball: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ["success", "failure"],
        default: "failure"
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Students',
        required: true
    },
    examId: {
        type: Schema.Types.ObjectId,
        ref: 'Exams',
        required: true
    }
})

const Results = model("Results", schema);

module.exports = Results;