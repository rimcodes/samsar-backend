const mongoose = require("mongoose");

//Mongoose/Model Config
const postSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: String,
    body: String,
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    date: {type: Date, default: Date.now}
});

postSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postSchema.set('toJSON', {
    virtuals: true
});

exports.Post = mongoose.model("Post", postSchema);
exports.postSchema = postSchema;
