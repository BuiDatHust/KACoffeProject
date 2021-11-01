const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const review = new Schema({
    rating: { type: Number, require: true, default: 0 },
    title: { type: String, require: true, maxLength: 200, minLength: 1, },
    comment: { type: String, require: true, maxLength: 200, minLength: 1, },
    user: { type: mongoose.Types.ObjectId, ref: User, required: true },
    product: { type: mongoose.Types.ObjectId, ref: Product, required: true },
})
module.exports = mongoose.model('review', review);