const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const path = require('path');

const createProduct = async(req, res) => {
    req.body.user = req.user.userId;
    req.body.Image = [];

    console.log(req.files);
    req.files.forEach(function(img) {
        const length = img.destination.length;
        req.body.Image = [
            ...req.body.Image,
            img.destination.slice(8, length) + '/' + img.filename,
        ];
    });

    const product = await Product.create(req.body);

    res.redirect('/KACoffe/v1/admin');
};

const getAllProducts = async(req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).render('menu', { products: products });
};

const updateProduct = async(req, res) => {
    const { id: productId } = req.params;

    var update = req.body;
    var updateForm = {};

    Object.keys(update).forEach((key) => {
        if (update[key]) {
            updateForm[key] = update[key];
        }
    });
    console.log(updateForm);

    const product = await Product.findOneAndUpdate({ _id: productId },
        updateForm
    );

    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }

    res.redirect('/KACoffe/v1/admin');
};
const getupdateProductPage = async(req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    console.log(product);

    res.render('updateProduct', {
        user: req.user,
        productid: id,
        product: product,
    });
};

const deleteProduct = async(req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });
    const products = await Product.find({});

    if (!product) {
        throw new NotFoundError(`No product with id : ${productId}`);
    }

    await product.remove();
    res.redirect('/KACoffe/v1/admin');
};

const saveComment = async(req, res) => {
    req.body.user = req.user.userId;
    const user = await User.findOne({ _id: req.user.userId });
    req.body.title = user.name;
    req.body.rating = 5;
    console.log(req.body.comment);


    const comment = await Review.create(req.body);

    res.redirect('/KACoffe/v1/menu/' + req.body.product);
};

const deleteComment = async(req, res) => {
    const {commentId,productId} =req.params
    console.log(productId)
    const comment = await Review.findOne({ _id: commentId });

    await comment.remove();
    res.redirect('/KACoffe/v1/menu/' + productId);
};

module.exports = {
    createProduct,
    getAllProducts,
    // getSingleProduct,
    updateProduct,
    deleteProduct,
    getupdateProductPage,
    saveComment,
    deleteComment
};