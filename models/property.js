const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    location: {
        type: String,
        default: ''
    },
    address: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    phone: {
        type: Number
    },
    rooms: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    sell: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    mogata: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mogata',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }

});

propertySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

propertySchema.set('toJSON', {
    virtuals: true
});

exports.Property = mongoose.model('Property', propertySchema);
exports.propertySchema = propertySchema;
