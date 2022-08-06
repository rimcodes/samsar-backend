const mongoose = require('mongoose');

const demandSchema = mongoose.Schema({
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

demandSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

demandSchema.set('toJSON', {
    virtuals: true
});

exports.Demand = mongoose.model('Demand', demandSchema);
exports.demandSchema = demandSchema;
