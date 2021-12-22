const { NotFoundError } = require("../errors");
const Discount = require("../models/Discount");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Story = require("../models/Story");
const User = require("../models/User");
var ObjectId = require('mongodb').ObjectID;

const createProductPage = async (req, res) => {
    res.render('addProduct', { user: req.user })
}

const createDiscountPage = async (req, res) => {
    res.render('addDiscount', { user: req.user, discount: 0, warning: undefined })
}

const createDiscount = async (req, res) => {
    const newDiscount = req.body
    if (newDiscount.startTime >= newDiscount.endTime) {
        res.render('addDiscount', { user: req.user, discount: newDiscount, warning: "Thời gian không hợp lệ!" })
        return
    }
    const discount = await Discount.create(newDiscount)
    if (discount.endTime < Date.now()) {
        discount.remove()
        res.render('addDiscount', { user: req.user, discount: newDiscount, warning: "Mã giảm giá đã hết hạn!" })
        return
    }
    res.redirect('/KACoffe/v1/admin')
}

const updateDiscountPage = async (req, res) => {
    const { id: discountId } = req.params
    const discount = await Discount.findOne({ _id: discountId });
    res.render('updateDiscount', { user: req.user, discount: discount })
}

const updateDiscount = async (req, res) => {
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

const deleteDiscount = async (req, res) => {
    const { id: discountId } = req.params
    const discount = await Discount.findOne({ _id: discountId });

    if (!discount) {
        throw new NotFoundError(`No discount with id : ${discountId}`);
    }

    await discount.remove();
    res.redirect('/KACoffe/v1/admin');
}
const updateRoleUserAsAdmin = async (req, res) => {
    const { id: userId } = req.params
    const user = await User.findOne({ _id: userId });
    const update1 = user
    update1.role = 'admin'
    if (!user) {
        throw new NotFoundError(`No user with id: ${userId}`);
    }
    await User.findOneAndUpdate({ _id: userId }, update1, {
        new: true
    })
    res.redirect('/KACoffe/v1/admin');
}
const createStoryPage = async (req, res) => {
    res.render('addStories', { user: req.user })
}

const getUpdateStoryPage = async (req, res) => {
    res.render('updateStories', { user: req.user })
}

const createStory = async (req, res) => {
    req.body.user = req.user.userId
    console.log(req.files)
    const length = req.files.destination.length
    req.body.image = req.files.destination.slice(8, length) + '/' + req.files.filename;

    const story = await Story.create(req.body)
    res.redirect('/KACoffe/v1/admin')
}

const updateStory = async (req, res) => {
    const { id: storyId } = req.params
    const { title, description, detaildescription } = req.body

    const story = await Story.findByIdAndUpdate(storyId, { title: title, description: description, detaildescription: detaildescription })
    res.redirect('/KACoffe/v1/admin')
}

const deleteStory = async (req, res) => {
    const story = await Story.findByIdAndDelete(req.params.id)
    console.log(story)
    res.redirect('/KACoffe/v1/admin')
}

let getInfoAdmin = async (req, res) => {
    const product = await Product.find({})
    const story = await Story.find({})
    const discount = await Discount.find({})
    const users = await User.find({})
    const user = await User.findOne({ _id: req.user.userId })
    var order = await Order.find({})
    const count = await Order.count({})

    story.reverse()
    discount.reverse()
    order.reverse()

    let rate = [0, 0, 0, 0, 0, 0]
    let avenue = 0,
        sumorder = 0,
        newcustomer = 0,
        sum = 0

    order.forEach(function (e) {
        if (e.createdAt.getFullYear() >= 2021) {
            avenue += e.subtotal;
            sumorder += 1;

            if (e.user == undefined) {
                newcustomer += 1
            }
        }

    })

    users.forEach(function (e) {
        if (e.createdAt.getFullYear() >= 2021) {
            newcustomer += 1
        }
    })

    console.log(avenue, sumorder, newcustomer)
    discount.forEach(discount => {
        if (discount.endTime < Date.now()) {
            discount.remove()
        }
    })
    avenue = +(avenue / 1000000).toFixed(2)

    // chart 1
    let time = [];
    let money = [];
    let guess = [];
    let today = new Date();
    console.log(today)
    let weekNow = (today.getDate() / 7 + 1).toFixed(0);
    if (weekNow > 4) weekNow = 4;
    let monthNow = today.getMonth() + 1;
    let yearNow = today.getFullYear();
    for (let i = 0; i <= 11; i++) {
        time.push("week " + weekNow + " - " + monthNow + " - " + yearNow);
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
    console.log(time);

    for (let i = 0; i <= 11; i++) {
        money.push(0);
        guess.push(0);
    }

    order.forEach(function(e) {
        weekNow = (e.createdAt.getDate() / 7 + 1).toFixed(0);
        if (weekNow > 4) weekNow = 4;

        monthNow = e.createdAt.getMonth() + 1;
        yearNow = e.createdAt.getFullYear();
        let orderDate = "week " + weekNow + " - " + monthNow + " - " + yearNow;
        for (let i = 0; i <= 11; i++) {
            if (time[i].localeCompare(orderDate) == 0) {
                money[i] += e.subtotal;
                if (e.user == undefined) {
                    guess[i] += 1
                }
                break;
            }
        }
    })
    users.forEach(function(e) {
        weekNow = (e.createdAt.getDate() / 7 + 1).toFixed(0);
        if (weekNow > 4) weekNow = 4;
        monthNow = e.createdAt.getMonth() + 1;
        yearNow = e.createdAt.getFullYear();
        let usersDate = "week " + weekNow + " - " + monthNow + " - " + yearNow;
        for (let i = 0; i <= 11; i++) {
            if (time[i].localeCompare(usersDate) == 0) {
                guess[i] += 1
                break;
            }
        }
    })
    for (let i = 0; i <= 11; i++) {
        money[i] = (money[i] / 1000000).toFixed(2)
    }
    console.log(money)
    console.log(guess)

    //chart2
    let amount = [0, 0, 0, 0, 0];
    const ods = await Order.find({})
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: Product,
                select: 'category'
            }
        })
    ods.forEach(order => {
        if (order.status == 'shipper đang lấy hàng') {
            order.orderItems.forEach(orderitem => {
                const category = orderitem.product.category;
                if (category == 'Cà phê') {
                    amount[0] += Number(orderitem.amount)
                } else if (category == 'Trà trái cây-Trà sữa') {
                    amount[1] += 1 * orderitem.amount
                } else if (category == 'Đá xay-Choco-Matcha') {
                    amount[2] += Number(orderitem.amount)
                } else if (category == 'Đồ uống nhanh') {
                    amount[3] += Number(orderitem.amount)
                } else if (category == 'Drinks') {
                    amount[4] += Number(orderitem.amount)
                }
            })
        }
    })
    var total1 = 0;
    console.log(amount)
    amount.forEach(e => {
        total1 += e;
    })
    let percent = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        percent[i] = (amount[i] * 100 / total1).toFixed(2);
    }
    console.log(percent)
    return {
        pages: Math.ceil(count / 10),
        user: user,
        products: product,
        stories: story,
        discounts: discount,
        users: users,
        chart: { avenue, sumorder, newcustomer },
        chart1: { time, money, guess },
        rate: rate.join(" "),
        data1: percent
    }
}

const getAdminPage = async (req, res) => {
    let info = await getInfoAdmin(req, res)

    var perPage = 10
    var page = 1

    const orderpage = await Order.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
    info.orders = orderpage
    info.page = 1

    res.render('admin', info);
}

const getAdminOrderPage = async (req, res) => {
    let info = await getInfoAdmin(req, res)

    var page = req.params.page
    var perPage = 10

    const orderpage = await Order.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
    info.orders = orderpage
    info.page = page

    res.render('admin', info)
}

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const status = req.body.capnhat;
    console.log(status)

    await User.findByIdAndUpdate(id, { status: status })
    res.redirect('/KACoffe/v1/admin')
}


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
    getAdminOrderPage,
}