const mongoose = require('mongoose');

const Discount = new mongoose.Schema({
    minusPrice: { type: Number, required: true, default: 0 },
    name: { type: String, required: true, unique: true },
    category: { type: String, enum: ['shippingfee', 'money', 'rate'] },
    condition1: { type: String, required: true },
    condition2: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});
module.exports = mongoose.model('Discount', Discount);
