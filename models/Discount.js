const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const discount = new Schema({
    minusPrice: { type: Number, required: true, default: 0 },
    apply: { type: String, required: true, enum: ['sliver', 'gold', 'bronze'], }
})
module.exports = mongoose.model('discount', discount);