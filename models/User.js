const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const user = new mongoose.Schema({
    name: {type: String, required: true, maxLength: 100,},
    phone: {type: String, required: true},
    password: {type: String, required: true, minLength: 8},
    rank: {
        type: String,
        enum:["gold","sliver","bronze","no ranking"],
        default: "no ranking"
    },
    email: {type:String, required: true},
    role: {type: String, required: true},
    
})

user.pre('save', async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

user.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('user', user);