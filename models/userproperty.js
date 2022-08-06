const mongoose = require('mongoose');

const userPropertySchema = mongoose.Schema({
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
    rooms: {
        type: Number,
        default: 0
    },
    phone: {
        type: Number
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

userPropertySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userPropertySchema.set('toJSON', {
    virtuals: true
});

exports.UserProperty = mongoose.model('UserProperty', userPropertySchema);
exports.userPropertySchema = userPropertySchema;