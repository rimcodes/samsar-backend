const mongoose = require("mongoose");

//Mongoose/Model Config
const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
    
});


topicSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

topicSchema.set('toJSON', {
    virtuals: true
});

exports.Topic = mongoose.model("Topic", topicSchema);
exports.topicSchema = topicSchema;
