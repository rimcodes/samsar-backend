const mongoose = require('mongoose');

const medinaSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    wilaya: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mogata',
        required: true
    }
});

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true
});

exports.Medina = mongoose.model('Medina', medinaSchema);
exports.medinaSchema = medinaSchema;
