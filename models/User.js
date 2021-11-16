const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const user = new Schema({
    name: {type: String, require: true, maxLength: 100,},
    phoneNumber: {type: Number, require: true},
    //defaultAddress: {type: String, require: false},
    password: {type: String, require: true, minLength: 8},
    voucher: [mongoose.Types.ObjectId],
    rank: {type: String, require: true},
    email: {type:String, require: true},
    role: {type: Boolean, require: true},
    orderStatus: {
        type: String,
        Order: mongoose.Types.ObjectId,
    },
})
module.exports = mongoose.model('user', user);