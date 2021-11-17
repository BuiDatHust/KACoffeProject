const mongoose = require('mongoose')

const SingleOrderSchema = mongoose.Schema({
    name: { type : String, required: true },
    Image: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    discount: {
        type: mongoose.Schema.ObjectId,
        ref: 'Discount',
        required: false,
    }
})

const Order = mongoose.Schema({
    subtotal: { type:String, required: true },
    total: { type: String, required: true },
    phone: { type: String, required: true },
    orderItems: [SingleOrderSchema],
    status: {
        type: String, 
        enum: [ "tìm shipper", "shipper đang lấy hàng", "shipper đang giao", "giao thành công"  ],
        default: "tìm shipper",
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Order', Order)