const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const user = new Schema({
    name: {type: String, require: true, maxlength: 100,},
    phonenumber: {type: Number, require: true},
    defautAddress: {type: String, require: false},
})
module.exports = mongoose.model('user', user);