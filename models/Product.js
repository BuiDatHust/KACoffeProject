const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
    name: { type: String, required: [ true, 'Please provide name field' ], maxLength: [ 50, "Name can not be more than 50 character" ] },
    category: {
        type: String,
        enum: ["cafe", "trà trái cây-trà sữa","đá xay-choco-matcha", "đồ pha chế sẵn","drinks"],
        required: true,
    },
    price: { type: Number, required: [ true, 'Please provide price field' ] },
    description: { type: String, required: [ true, 'Please provide description field' ], maxLength: [ 200, "Description can not be more than 200 character" ] },
    Image: { type: String, required: [ true, 'Please provide link image' ] },
    material:{ type: String, required: [true, "Please provide Material"] },
    averageRating: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

module.exports = mongoose.model('products', Product)