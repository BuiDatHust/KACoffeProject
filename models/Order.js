const mongoose = require('mongoose');

const SingleOrderSchema = mongoose.Schema({
    name: { type: String, required: true },
    Image: { type: String, required: false },
    price: { type: Number, required: true },
    size: {
        type: String,
        enum: ['S', 'M', 'L'],
        required: false,
    },
    amount: { type: Number, required: true },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
    discount: {
        type: mongoose.Schema.ObjectId,
        ref: 'Discount',
        required: false,
    },
});

const Order = mongoose.Schema(
    {
        subtotal: { type: Number, required: true },
        total: { type: Number, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: false },
        orderItems: [SingleOrderSchema],
        status: {
            type: String,
            enum: [
                'tìm shipper',
                'shipper đang lấy hàng',
                'shipper đang giao',
                'giao thành công',
            ],
            default: 'tìm shipper',
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', Order);
