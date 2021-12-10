const Discount = require("../models/Discount");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Story = require("../models/Story");
const User = require("../models/User");

const createProductPage =async (req,res) =>{
    res.render('addProduct', { user: req.user })
}

const getAdminPage = async (req,res) =>{
    const product = await Product.find({})
    const story = await Story.find({})
    const discount = await Discount.find({})
    const order = await Order.find({})
    const users = await User.find({})
    const user = await User.findOne({_id: req.user.userId})

    res.render('admin', { 
        user: user, 
        products: product,
        stories: story ,
        discounts:discount,
        orders: order,
        users: users,
    });
}


module.exports = {
    getAdminPage ,
    createProductPage
}