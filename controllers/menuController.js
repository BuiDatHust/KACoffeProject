const Product = require('../models/Product');
const Review = require('../models/Review');
// const Discount = require('../models/Discount')
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

const getproducts = async(req, res) => {
    const products = await Product.find({}).sort({ _id: -1 });
    var user;

    if (req.user === undefined) {
        user = 0;
    } else {
        user = req.user;
    }
    res.render('menu', {
        products: products,
        user: user,
    });
};

const getSingleProduct = async(req, res) => {
    const { id: productId } = req.params;
    var user;
    // const product = await Product.findOne({ _id: productId }).populate('reviews');
    const product = await Product.findOne({ _id: productId });

    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }

    if (req.user === undefined) {
        user = 0;
    } else {
        user = await User.findOne({ _id: req.user.userId });
    }

    let comments = await Review.find({
        product: productId,
    });
    comments.forEach(function(e) {
        e.created =
            e.createdAt.getDate() +
            '/' +
            (e.createdAt.getMonth() + 1) +
            '/' +
            e.createdAt.getFullYear();
    });
    // console.log(comments);

    console.log(user._id);
    res.status(StatusCodes.OK).render('detail', {
        rating: 3.5,
        comments: comments,
        product: product,
        user: user,
        warning: '',
        len: comments.length,
    });
};

const filterProduct = async(req, res) => {
    let { category, min, max, sort } = req.body;

    const sortquery = sort == 'ASC' ? 'price' : '-price';
    const categoryquery = category == 'all' ? {} : { category: category };
    console.log(categoryquery);

    let products = await Product.find(categoryquery).sort(sortquery);

    min = parseInt(min);
    max = parseInt(max);
    if (min != NaN && max != NaN) {
        products = products.filter(function(e) {
            return e.price > min && e.price < max;
        });
    }
    //console.log(products);

    res.render('menu', { products: products, user: req.user });
};

module.exports = {
    getproducts,
    getSingleProduct,
    filterProduct,
};