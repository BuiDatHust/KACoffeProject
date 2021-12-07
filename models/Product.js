const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
    name: { type: String, required: [ true, 'Please provide name field' ], maxLength: [ 50, "Name can not be more than 50 character" ] },
    category: {
        type: String,
        enum: ["Cà phê", "Trà trái cây-Trà sữa","Đá xay-Choco-Matcha", "Đồ uống nhanh","Drinks"],
        required: true,
    },
    price: { type: Number, required: [ true, 'Please provide price field' ] },
    realprice:{ type: Number, required: false },
    description: { type: String, required: [ true, 'Please provide description field' ], maxLength: [ 200, "Description can not be more than 200 character" ] },
    detaildescription: { type: String, required: false },
    Image: {  },
    material:{ type: String, required: [true, "Please provide Material"] },
    averageRating: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

module.exports = mongoose.model('products', Product)