const { model, Schema } = require("mongoose")


const schema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Students',
        required: true
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'groups',
        required: true
    }
})


const GroupStudents = model('GroupStudents', schema);

module.exports = GroupStudents;