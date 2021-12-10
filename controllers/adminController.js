const Discount = require("../models/Discount");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Story = require("../models/Story");
const User = require("../models/User");

const createProductPage =async (req,res) =>{
    res.render('addProduct', { user: req.user })
}

const createDiscountPage = async (req,res) => {
    res.render('addDiscount', { user: req.user })
}
  
const createDiscount = async (req,res) => {
    const discount = await Discount.create( req.body )
    res.redirect('/KACoffe/v1/admin')
}

const updateDiscountPage = async (req,res) => {
    const { id: discountId } = req.params
    const discount = await Discount.findOne({ _id: discountId });
    res.render('updateDiscount', { user: req.user, discount: discount })
}

const updateDiscount = async (req,res) => {
    const { id: discountId } = req.params
    var update = req.body ;
    var updateForm = {};
    
    Object.keys(update).forEach(key =>{
      if( update[key] ){
          updateForm[key] = update[key];
      }
    })

    const updateDiscount = await Discount.findOneAndUpdate({ _id: discountId }, updateForm);

    if (!updateDiscount) {
        throw new NotFoundError(`No discount with id : ${discountId}`);
    }

    res.redirect('/KACoffe/v1/admin')
}

const deleteDiscount = async (req, res) => {
    const { id: discountId } = req.params
    const discount = await Discount.findOne({ _id: discountId });
  
    if (!discount) {
      throw new NotFoundError(`No discount with id : ${discountId}`);
    }
  
    await discount.remove();
    res.redirect('/KACoffe/v1/admin');
}

const createStoryPage = async (req, res) => {
    
}

const createStory = async (req,res) => {
    req.body.user = req.user.userId
    const story = await Story.create(req.body)
    res.status(StatusCodes.CREATED).json({ story })
}

const getAdminPage = async (req,res) =>{
    const product = await Product.find({})
    const story = await Story.find({})
    const discount = await Discount.find({})
    const order = await Order.find({})
    const users = await User.find({})
    const user = await User.findOne({_id: req.user.userId})

    story.reverse()
    discount.reverse()
    order.reverse()

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
    createProductPage,
    createDiscountPage,
    createStoryPage,
    createDiscount,
    deleteDiscount,
    updateDiscountPage,
    updateDiscount,
    createStory,
}