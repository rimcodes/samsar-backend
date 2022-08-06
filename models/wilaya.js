const mongoose = require('mongoose');

const wilayaSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

wilayaSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

wilayaSchema.set('toJSON', {
    virtuals: true
});

exports.Wilaya = mongoose.model('Wilaya', wilayaSchema);
exports.wilayaSchema = wilayaSchema;
