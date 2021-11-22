const mongoose = require('mongoose');

const Discount = new mongoose.Schema({
    minusPrice: { type: Number, required: true, default: 0 },
    name: { type: String, required: true },
    apply: { type: String, required: true, enum: ['sliver', 'gold', 'bronze'], }
})
module.exports = mongoose.model('Discount', Discount);