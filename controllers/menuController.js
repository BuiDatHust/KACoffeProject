const Product = require('../models/Product')
// const Discount = require('../models/Discount')
const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')

const getproducts = async (req, res) => {
    const products = await Product.find({})
    var user

    if( req.user===undefined ){
        user = 0
    }else{
        user = req.user
    }
    res.render('menu', {
        products: products,
        user: user
    })
    
}

const getSingleProduct = async (req, res) => {
    const { id: productId } = req.params;
    var user
    // const product = await Product.findOne({ _id: productId }).populate('reviews');
    const product = await Product.findOne({ _id: productId })

    if (!product) {
      throw new NotFoundError(`No product with id : ${productId}`);
    }

    if( req.user===undefined ){
        user = 0
    }else{
        user = await User.findOne({ _id: req.user.userId })
    }
    
    res.status(StatusCodes.OK).render('detail', {product: product, user: user});
};

module.exports = {
    getproducts,
    getSingleProduct
}