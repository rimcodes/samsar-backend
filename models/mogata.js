const mongoose = require('mongoose');

const mogataSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    wilaya: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wilaya',
        required: true
    }
});

mogataSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

mogataSchema.set('toJSON', {
    virtuals: true
});

exports.Mogata = mongoose.model('Mogata', mogataSchema);
exports.mogataSchema = mogataSchema;
