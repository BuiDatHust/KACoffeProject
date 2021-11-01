const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    Image: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    user: { type: String, required: true },
})

module.exports = mongoose.model('products', Product)