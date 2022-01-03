const Product = require('../models/Product');
const Discount = require('../models/Discount');
const Story = require('../models/Story');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

function difference(date1, date2) {
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    day = 1000 * 60 * 60 * 24;
    return (date2utc - date1utc) / day
}

const getHomepage = async(req, res) => {
    let productNew = await Product.find({}).sort({ _id: -1 });
    let caPhe = await Product.find({ category: 'Cà phê' }).sort({ _id: -1 });
    let traSua = await Product.find({ category: 'Trà trái cây-Trà sữa' }).sort({
        _id: -1,
    });
    let daXay = await Product.find({ category: 'Đá xay-Choco-Matcha' }).sort({
        _id: -1,
    });
    let doUongNhanh = await Product.find({ category: 'Đồ uống nhanh' }).sort({
        _id: -1,
    });
    let drinks = await Product.find({ category: 'Drinks' }).sort({ _id: -1 });

    productNew = productNew.slice(0, 3);
    caPhe = caPhe.slice(0, 3);
    traSua = traSua.slice(0, 3);
    daXay = daXay.slice(0, 3);
    drinks = drinks.slice(0, 3);
    doUongNhanh = doUongNhanh.slice(0, 3);

    let user = false;
    if (req.user != undefined) {
        user = req.user;
    }

    // push data numbers to index page
    let beginDate = new Date("2021-10-7");
    let today = new Date();
    let numbersOfUsers = 0;
    let numbersOfDiscount = 0;
    let dayServed = difference(beginDate, today);
    let monthServed = dayServed / 30 + 1;
    const users = await User.find({});
    console.log(today);
    users.forEach(function(e) {
        if (e.score > 0) {
            numbersOfUsers += 1;
        }
    })
    const discounts = await Discount.find({});
    discounts.forEach(function(e) {
        if (e.endTime > Date.now()) {
            numbersOfDiscount += 1;
        }
    })

    res.status(StatusCodes.OK).render('index', {
        user: user,
        productNew: productNew,
        caPhe: caPhe,
        traSua: traSua,
        daXay: daXay,
        doUongNhanh: doUongNhanh,
        drinks,
        drinks,
        status: '',
        numbersOfDiscount,
        numbersOfUsers,
        dayServed,
        monthServed,
    });
};

const getDiscount = async(req, res) => {
    const discount = await Discount.find({}).sort({ _id: -1 });
    for (var dc of discount) {
        if (dc.endTime < Date.now()) {
            await dc.remove();
        }
    }

    const newDiscount = discount.filter((dc) => {
        return dc.endTime > Date.now();
    });

    var user;

    if (req.user === undefined) {
        user = 0;
    } else {
        user = req.user;
    }

    res.status(StatusCodes.OK).render('tracuu', {
        discount: newDiscount,
        user: user,
        error: '',
        status: 2,
    });
};

const getStories = async(req, res) => {
    const stories = await Story.find({}).populate({
        path: 'user',
        model: User,
        select: 'name',
    });
    stories.reverse();
    const page = req.query.page || 1;

    var user;

    if (req.user === undefined) {
        user = 0;
    } else {
        user = req.user;
    }
    console.log(user);

    res.status(StatusCodes.OK).render('stories', {
        stories: stories.slice((page - 1) * 6, page * 6),
        page: parseInt(page),
        totalPage: Math.ceil(stories.length / 6),
        user: user,
    });
};

const getSingleStory = async(req, res) => {
    const { id: storyId } = req.params;
    var user;
    // const story = await Story.findOne({ _id: storyId }).populate('reviews');
    const story = await Story.findOne({ _id: storyId });

    if (!story) {
        throw new NotFoundError(`No story with id : ${storyId}`);
    }

    if (req.user === undefined) {
        user = 0;
    } else {
        user = req.user;
    }
    console.log(user);

    res.status(StatusCodes.OK).render('story', {
        story: story,
        user: user,
    });
};

const getNotification = async(req, res) => {
    const user = await User.findOne({ _id: req.user.userId });

    user.notification.reverse();

    res.render('notification', { noti: user.notification, user: req.user });
};

module.exports = {
    getHomepage,
    getDiscount,
    getStories,
    getNotification,
    getSingleStory,
};