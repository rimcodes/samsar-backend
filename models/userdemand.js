const mongoose = require('mongoose');

const userDemandSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

userDemandSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userDemandSchema.set('toJSON', {
    virtuals: true
});

exports.UserDemand = mongoose.model('UserDemand', userDemandSchema);
exports.userDemandSchema = userDemandSchema;
