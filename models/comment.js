const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String
    },
});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', {
    virtuals: true
});

exports.Comment = mongoose.model('Comment', commentSchema);
exports.commentSchema = commentSchema;
