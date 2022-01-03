const { NotFoundError } = require('../errors');
const Discount = require('../models/Discount');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Story = require('../models/Story');
const User = require('../models/User');
var ObjectId = require('mongodb').ObjectID;

const createProductPage = async(req, res) => {
    res.render('addProduct', { user: req.user });
};

const createDiscountPage = async(req, res) => {
    res.render('addDiscount', {
        user: req.user,
        discount: 0,
        warning: undefined,
    });
};

const createDiscount = async(req, res) => {
    const newDiscount = req.body;
    if (newDiscount.startTime >= newDiscount.endTime) {
        res.render('addDiscount', {
            user: req.user,
            discount: newDiscount,
            warning: 'Thời gian không hợp lệ!',
        });
        return;
    }
    const discount = await Discount.create(newDiscount);
    if (discount.endTime < Date.now()) {
        discount.remove();
        res.render('addDiscount', {
            user: req.user,
            discount: newDiscount,
            warning: 'Mã giảm giá đã hết hạn!',
        });
        return;
    }
    res.redirect('/KACoffe/v1/admin/discount');
};

const updateDiscountPage = async(req, res) => {
    const { id: discountId } = req.params;
    const discount = await Discount.findOne({ _id: discountId });
    res.render('updateDiscount', { user: req.user, discount: discount });
};

const updateDiscount = async(req, res) => {
    const { id: discountId } = req.params;
    var update = req.body;
    var updateForm = {};

    Object.keys(update).forEach((key) => {
        if (update[key]) {
            updateForm[key] = update[key];
        }
    });

    const updateDiscount = await Discount.findOneAndUpdate({ _id: discountId },
        updateForm
    );

    if (!updateDiscount) {
        throw new NotFoundError(`No discount with id : ${discountId}`);
    }

    res.redirect('/KACoffe/v1/admin/discount');
};

const deleteDiscount = async(req, res) => {
    const { id: discountId } = req.params;
    const discount = await Discount.findOne({ _id: discountId });

    if (!discount) {
        throw new NotFoundError(`No discount with id : ${discountId}`);
    }

    await discount.remove();
    res.redirect('/KACoffe/v1/admin/discount');
};
const updateRoleUserAsAdmin = async(req, res) => {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId });
    const update1 = user;
    update1.role = 'admin';
    if (!user) {
        throw new NotFoundError(`No user with id: ${userId}`);
    }
    await User.findOneAndUpdate({ _id: userId }, update1, {
        new: true,
    });
    res.redirect('/KACoffe/v1/admin/user');
};
const createStoryPage = async(req, res) => {
    res.render('addStories', { user: req.user });
};

const getUpdateStoryPage = async(req, res) => {
    const { id: storyId } = req.params;
    const story = await Story.findOne({ _id: storyId });

    res.render('updateStories', { user: req.user, story: story });
};

const createStory = async(req, res) => {
    req.body.user = req.user.userId;

    req.body.image = '/uploads/' + req.file.filename;
    const story = await Story.create(req.body);
    res.redirect('/KACoffe/v1/admin/stories');
};

const updateStory = async(req, res) => {
    const { id: storyId } = req.params;
    const { title, description, detaildescription } = req.body;

    const story = await Story.findByIdAndUpdate(storyId, {
        title: title,
        description: description,
        detaildescription: detaildescription,
    });
    res.redirect('/KACoffe/v1/admin/stories');
};

const deleteStory = async(req, res) => {
    const story = await Story.findByIdAndDelete(req.params.id);
    console.log(story);
    res.redirect('/KACoffe/v1/admin/stories');
};

const getAdminPage = async(req, res) => {
    const page = req.query.page || 1;
    const perPage = 10;
    const count = await Product.count({});
    const pages = Math.ceil(count / perPage);

    const products = await Product.find({})
        .sort({ _id: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage);

    res.render('admin/products', {
        user: req.user,
        products: products,
        page: page,
        pages: pages,
    });
};

const getAdminDiscountPage = async(req, res) => {
    const discounts = await Discount.find({}).sort({ _id: -1 });

    for (var dc of discounts) {
        if (dc.endTime < Date.now()) {
            await dc.remove();
        }
    }

    const newDiscounts = discounts.filter((dc) => {
        return dc.endTime > Date.now();
    });

    res.render('admin/discount', {
        user: req.user,
        discounts: newDiscounts,
    });
};

const getAdminUserPage = async(req, res) => {
    const users = await User.find({}).sort({ score: -1 });

    res.render('admin/user', {
        user: req.user,
        users: users,
    });
};

const getAdminOrderPage = async(req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;
    const count = await Order.count({ status: { $ne: 'tìm shipper' } });
    const pages = Math.ceil(count / perPage);

    console.log(count);

    const orders = await Order.find({ status: { $ne: 'tìm shipper' } })
        .sort({ _id: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage);

    res.render('admin/order', {
        user: req.user,
        orders: orders,
        page: page,
        pages: pages,
    });
};

const getAdminStoriesPage = async(req, res) => {
    const stories = await Story.find({}).sort({ _id: -1 });

    res.render('admin/stories', {
        user: req.user,
        stories: stories,
    });
};

const getAdminStatisticPage = async(req, res) => {
    const users = await User.find({});
    const orders = await Order.find({ status: { $ne: 'tìm shipper' } })
        .sort({ _id: -1 })
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'category',
            },
        });

    let rate = [0, 0, 0, 0, 0, 0];
    let avenue = 0,
        sumorder = 0,
        newcustomer = 0,
        sum = 0,
        oldAvenue = 0,
        oldSumOrder = 0,
        oldCustomer = 0;

    let time = [];
    let money = [];
    let guess = [];
    let today = new Date();
    let weekNow = Math.ceil(today.getDate() / 7);
    if (weekNow > 4) weekNow = 4;
    let monthNow = today.getMonth() + 1;
    let yearNow = today.getFullYear();

    // Thống kê
    orders.forEach(function(e) {
        if (e.createdAt.getMonth() == monthNow - 1) {
            avenue += e.subtotal;
            sumorder += 1;
            if (e.user == undefined) {
                newcustomer += 1;
            }
        } else if (e.createdAt.getMonth() == monthNow - 2) {
            oldAvenue += e.subtotal;
            oldSumOrder += 1;
            if (e.user == undefined) {
                oldCustomer += 1;
            }
        }
    });
    users.forEach(function(e) {
        if (e.createdAt.getMonth() == monthNow - 1) {
            newcustomer += 1;
        } else if (e.createdAt.getMonth() == monthNow - 2) {
            oldCustomer += 1;
        }
    });
    avenue = +(avenue / 1000000).toFixed(2);
    oldAvenue = +(oldAvenue / 1000000).toFixed(2);

    // chart 1
    for (let i = 0; i <= 11; i++) {
        time.push('week ' + weekNow + ' - ' + monthNow + ' - ' + yearNow);
        if (weekNow == 1) {
            weekNow = 4;
            if (monthNow == 1) {
                monthNow = 12;
                yearNow--;
            } else {
                monthNow--;
            }
        } else {
            weekNow--;
        }
    }
    time.reverse();

    for (let i = 0; i <= 11; i++) {
        money.push(0);
        guess.push(0);
    }
    orders.forEach(function(e) {
        weekNow = Math.ceil(e.createdAt.getDate() / 7);
        if (weekNow > 4) weekNow = 4;
        monthNow = e.createdAt.getMonth() + 1;
        yearNow = e.createdAt.getFullYear();
        let orderDate = 'week ' + weekNow + ' - ' + monthNow + ' - ' + yearNow;
        for (let i = 0; i <= 11; i++) {
            if (time[i].localeCompare(orderDate) == 0) {
                money[i] += e.subtotal;
                if (e.user == undefined) {
                    guess[i] += 1;
                }
                break;
            }
        }
    });

    users.forEach(function(e) {
        weekNow = Math.ceil(e.createdAt.getDate() / 7);
        if (weekNow > 4) weekNow = 4;
        monthNow = e.createdAt.getMonth() + 1;
        yearNow = e.createdAt.getFullYear();
        let usersDate = 'week ' + weekNow + ' - ' + monthNow + ' - ' + yearNow;
        for (let i = 0; i <= 11; i++) {
            if (time[i].localeCompare(usersDate) == 0) {
                guess[i] += 1;
                break;
            }
        }
    });

    for (let i = 0; i <= 11; i++) {
        money[i] = (money[i] / 1000000).toFixed(2);
    }

    //chart2
    let amount = [0, 0, 0, 0, 0];
    yearNow = today.getFullYear();
    monthNow = today.getMonth();

    orders.forEach((order) => {
        if (
            order.createdAt.getFullYear() == yearNow &&
            order.createdAt.getMonth() == monthNow
        ) {
            order.orderItems.forEach((orderItem) => {
                if (orderItem.product) {
                    const category = orderItem.product.category;
                    if (category == 'Cà phê') {
                        amount[0] += Number(orderItem.amount);
                    } else if (category == 'Trà trái cây-Trà sữa') {
                        amount[1] += 1 * orderItem.amount;
                    } else if (category == 'Đá xay-Choco-Matcha') {
                        amount[2] += Number(orderItem.amount);
                    } else if (category == 'Đồ uống nhanh') {
                        amount[3] += Number(orderItem.amount);
                    } else if (category == 'Drinks') {
                        amount[4] += Number(orderItem.amount);
                    }
                }
            });
        }
    });

    var total1 = 0;
    amount.forEach((e) => {
        total1 += e;
    });

    let percent = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        percent[i] = ((amount[i] * 100) / total1).toFixed(2);
    }

    res.render('admin/statistic', {
        user: req.user,
        oldStatistic: { oldAvenue, oldSumOrder, oldCustomer },
        statistic: { avenue, sumorder, newcustomer },
        chart1: { time, money, guess },
        rate: rate.join(' '),
        chart2: percent,
    });
};

const updateOrder = async(req, res) => {
    const { id } = req.params;
    const status = req.body.capnhat;

    await Order.findByIdAndUpdate(id, { status: status });
    res.redirect('/KACoffe/v1/admin/order');
};

module.exports = {
    getAdminPage,
    createProductPage,
    createDiscountPage,
    createStoryPage,
    createDiscount,
    deleteDiscount,
    updateDiscountPage,
    updateDiscount,
    createStory,
    updateRoleUserAsAdmin,
    getUpdateStoryPage,
    updateStory,
    deleteStory,
    updateOrder,
    getAdminDiscountPage,
    getAdminUserPage,
    getAdminOrderPage,
    getAdminStoriesPage,
    getAdminStatisticPage,
};