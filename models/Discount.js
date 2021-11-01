const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const discount = new Schema({
    minusPrice: { type: Number, default: 0 },
    apply: { type: Date, }
})
module.exports = mongoose.model('discount', discount);