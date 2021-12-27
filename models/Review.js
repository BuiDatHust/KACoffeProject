const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const review = new mongoose.Schema({
    rating: { type: Number, required: true, default: 0 },
    title: { type: String, required: true, maxLength: 200, minLength: 1 },
    comment: { type: String, required: true, maxLength: 200, minLength: 1 },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
});
module.exports = mongoose.model('review', review);