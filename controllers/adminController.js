const Discount = require("../models/Discount");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Story = require("../models/Story");
const User = require("../models/User");

const createProductPage = async(req, res) => {
    res.render('addProduct', { user: req.user })
}

const createDiscountPage = async(req, res) => {
    res.render('addDiscount', { user: req.user })
}

const createDiscount = async(req, res) => {
    const discount = await Discount.create(req.body)
    res.redirect('/KACoffe/v1/admin')
}

const updateDiscountPage = async(req, res) => {
    const { id: discountId } = req.params
    const discount = await Discount.findOne({ _id: discountId });
    res.render('updateDiscount', { user: req.user, discount: discount })
}

const updateDiscount = async(req, res) => {
    const { id: discountId } = req.params
    var update = req.body;
    var updateForm = {};

    Object.keys(update).forEach(key => {
        if (update[key]) {
            updateForm[key] = update[key];
        }
    })

    const updateDiscount = await Discount.findOneAndUpdate({ _id: discountId }, updateForm);

    if (!updateDiscount) {
        throw new NotFoundError(`No discount with id : ${discountId}`);
    }

    res.redirect('/KACoffe/v1/admin')
}

const deleteDiscount = async(req, res) => {
    const { id: discountId } = req.params
    const discount = await Discount.findOne({ _id: discountId });

    if (!discount) {
        throw new NotFoundError(`No discount with id : ${discountId}`);
    }

    await discount.remove();
    res.redirect('/KACoffe/v1/admin');
}

const createStoryPage = async(req, res) => {
    res.render('addStory', { user: req.user })
}

const createStory = async(req, res) => {
    // req.body.Image = [...req.body.Image, img.destination.slice(8, length) + '/' + img.filename]

    req.body.user = req.user.userId;
    const story = await Story.create(req.body);
    res.redirect('/KACoffe/v1/admin')
}

const deleteStory = async(req, res) => {
    const { id: storyId } = req.params
    const story = await Story.findOne({ _id: storyId });

    if (!story) {
        throw new NotFoundError(`No  story with id : ${ storyId}`);
    }

    await story.remove();
    res.redirect('/KACoffe/v1/admin');
}

const updateStoryPage = async(req, res) => {
    const { id: storyId } = req.params
    const story = await Story.findOne({ _id: storyId });
    res.render('updateStory', { user: req.user, story: story })
}

const updateStory = async(req, res) => {
    const { id: storyId } = req.params
    var update = req.body;
    var updateForm = {};

    Object.keys(update).forEach(key => {
        if (update[key]) {
            updateForm[key] = update[key];
        }
    })

    const updateStory = await Story.findOneAndUpdate({ _id: storyId }, updateForm);

    if (!updateStory) {
        throw new NotFoundError(`No story with id : ${storyId}`);
    }

    res.redirect('/KACoffe/v1/admin')
}


const getAdminPage = async(req, res) => {
    const product = await Product.find({})
    const story = await Story.find({})
    const discount = await Discount.find({})
    const order = await Order.find({})
    const user = await User.find({})

    story.reverse()
    discount.reverse()
    order.reverse()

    res.render('admin', {
        user: req.user,
        products: product,
        stories: story,
        discounts: discount,
        orders: order,
        users: user
    });
}


module.exports = {
    getAdminPage,
    createProductPage,
    createDiscountPage,
    createDiscount,
    deleteDiscount,
    updateDiscountPage,
    updateDiscount,
    createStoryPage,
    createStory,
    deleteStory,
    updateStoryPage,
    updateStory,
}