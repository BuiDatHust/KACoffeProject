const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/badRequestError');
const { NotFoundError } = require('../errors/notFoundError');
const { Permission } = require('../utils');
const Discount = require('../models/Discount');
var nodeMailer = require('nodemailer');


function difference(date1, date2) {
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    day = 1000 * 60 * 60 * 24;
    return (date2utc - date1utc) / day
}

const evaluateScore = (user, subtotal) => {
    var score = user.score;
    if (subtotal > 50000 && subtotal < 10000) {
        score += 1;
    } else if (subtotal > 100000 && subtotal < 400000) {
        score += 5;
    } else {
        score += 10;
    }

    return score;
};

const createOrder = async(req, res) => {
    if (req.user !== undefined) {
        const cartItems = {
            amount: req.body.quantity,
            product: req.body.product,
            email: req.body.email,
        };
        if (!cartItems || cartItems.length < 1) {
            throw new BadRequestError('No cart items provided');
        }

        shippingFee = 10000;

        let orderItems = [];
        var subtotal;

        const dbUser = await User.findOne({ _id: req.user.userId });
        const dbProduct = await Product.findOne({ _id: cartItems.product });
        if (!dbProduct) {
            throw new Error(`No product with id : ${cartItems.product}`);
        }
        const { name, price, Image, _id } = dbProduct;
        const singleOrderItem = {
            amount: cartItems.amount,
            name,
            price,
            Image: Image[0],
            address: cartItems.address,
            product: _id,
            size: req.body.size,
        };

        var order;

        const existOrder = await Order.find({
            user: req.user.userId,
            status: 't??m shipper',
        });
        const len = existOrder.length;

        if (!existOrder.length == 0) {
            console.log('xss');
            var flag = false;
            existOrder[len - 1].orderItems.forEach(item => {
                if (item.name == singleOrderItem.name && item.size == singleOrderItem.size && item.price == singleOrderItem.price) {
                    flag = true;
                    item.amount = parseInt(item.amount) + parseInt(singleOrderItem.amount)
                }
            })
            if (!flag) {
                orderItems = [...existOrder[len - 1].orderItems, singleOrderItem];
            } else {
                orderItems = existOrder[len - 1].orderItems
            }

            total =
                existOrder[len - 1].total +
                singleOrderItem.price * singleOrderItem.amount;
            subtotal = total + shippingFee;
            const updateOrder = await Order.findByIdAndUpdate({ _id: existOrder[len - 1]._id }, { orderItems: orderItems, subtotal: subtotal, total: total });
            order = updateOrder;
        } else {
            total = singleOrderItem.price * singleOrderItem.amount;
            subtotal = total + shippingFee;
            orderItems = [...orderItems, singleOrderItem];

            const newOrder = await Order.create({
                orderItems,
                total: total,
                subtotal: subtotal,
                shippingFee,
                phone: dbUser.phone,
                user: req.user.userId,
            });
            order = newOrder;
        }

        res.status(StatusCodes.CREATED).redirect('order/cart');
    } else {
        const product = await Product.findOne({ _id: req.body.product });
        res.render('detail', {
            user: 0,
            product: product,
            warning: 'Vui l??ng ????ng nh???p ????? th??m v??o gi??? h??ng!',
        });
    }
};

const buyNotLogin = async(req, res) => {
    var { phone, name, amount, address, nameproduct, email, size } = req.body;
    var subtotal = 0,
        total = 0;

    let productNew = await Product.find({}).sort({ _id: -1 });
    let caPhe = await Product.find({ category: 'C?? ph??' }).sort({ _id: -1 });
    let traSua = await Product.find({ category: 'Tr?? tr??i c??y-Tr?? s???a' }).sort({
        _id: -1,
    });
    let daXay = await Product.find({ category: '???? xay-Choco-Matcha' }).sort({
        _id: -1,
    });
    let doUongNhanh = await Product.find({ category: '????? u???ng nhanh' }).sort({
        _id: -1,
    });
    let drinks = await Product.find({ category: 'Drinks' }).sort({ _id: -1 });

    let product = await Product.findOne({ name: nameproduct });


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


    if (!product) {
        res.render('index', {
            user: '',
            productNew: productNew,
            caPhe: caPhe,
            traSua: traSua,
            daXay: daXay,
            doUongNhanh: doUongNhanh,
            drinks,
            drinks,
            status: 'Kh??ng t??m th???y s???n ph???m n??y',
            numbersOfDiscount,
            numbersOfUsers,
            dayServed,
            monthServed,
        });
        return;
    }
    orderItems = [{
        name: nameproduct,
        Image: product.Image[0],
        price: product.price,
        amount: amount,
        size: size,
        product: product._id,
    }, ];
    total = product.price * amount;
    subtotal = total + 20000;

    const transporter = nodeMailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
    const mailOptions = {
        from: '"KaCoffee" <ka.coffee.hust@outlook.com>',
        to: req.body.email,
        subject: 'Ch??c m???ng b???n c?? ????n h??ng ?????u ti??n',
        html: '<b>Ch??c m???ng b???n c?? ????n h??ng ?????u ti??n: </b> H??y ????ng nh???p ????? c?? th??? h?????ng th??m ??u ????i',
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Sent: ' + info.response);
    });

    const order = await Order.create({
        status: 'shipper ??ang l???y h??ng',
        orderItems,
        total,
        subtotal,
        address,
        phone,
    });

    productNew = productNew.slice(0, 3);
    caPhe = caPhe.slice(0, 3);
    traSua = traSua.slice(0, 3);
    daXay = daXay.slice(0, 3);
    drinks = drinks.slice(0, 3);
    doUongNhanh = doUongNhanh.slice(0, 3);
    console.log(caPhe, traSua, daXay, drinks);

    res.render('index', {
        user: '',
        productNew: productNew,
        caPhe: caPhe,
        traSua: traSua,
        daXay: daXay,
        doUongNhanh: doUongNhanh,
        drinks,
        drinks,
        status: '?????t h??ng th??nh c??ng',
        numbersOfDiscount,
        numbersOfUsers,
        dayServed,
        monthServed,
    });
};

const buy = async(req, res) => {
    const orders = await Order.find({
        user: req.user.userId,
        status: 't??m shipper',
    });
    const user = await User.findOne({ _id: req.user.userId });
    const { magiamgia } = req.body;
    const discount = await Discount.findOne({ name: magiamgia });

    const len = orders.length - 1;
    const thisorder = orders[len];
    var total = thisorder ? thisorder.total : 0;

    console.log(thisorder.orderItems);

    if (req.body.address == '') {
        res.render('cart', {
            orders: thisorder ? thisorder.orderItems : [],
            total: thisorder ? thisorder.total : [],
            subtotal: thisorder ? thisorder.subtotal : 0,
            user: user,
            discount: user.discount,
            warning: 'B???n ch??a nh???p ?????a ch???!',
            noti: undefined,
        });
        return;
    }

    if (!thisorder || thisorder.orderItems.length == 0) {
        res.render('cart', {
            orders: [],
            total: 0,
            subtotal: 0,
            user: user,
            discount: user.discount,
            warning: 'Gi??? h??ng tr???ng!',
            noti: undefined,
        });
        return;
    }
    if (discount) {
        const category = discount.category;
        if (
            discount.condition1 === user.rank &&
            thisorder.subtotal > discount.condition2
        ) {
            switch (category) {
                case 'money':
                    total -= discount.minusPrice;
                    break;
                case 'rate':
                    total = total * (1 - discount.minusPrice / 100);
                    break;
                case 'shippingfree':
                    total -= 10000;
                    break;
                default:
                    break;
            }
            let userDiscount = user.discount;
            userDiscount = userDiscount.filter((e) => {
                return e != magiamgia;
            });
            console.log(userDiscount);
            await User.findOneAndUpdate({ _id: req.user.userId }, { discount: userDiscount });
        } else {
            res.render('cart', {
                orders: thisorder ? thisorder.orderItems : [],
                total: thisorder ? thisorder.total : [],
                subtotal: thisorder ? thisorder.subtotal : 0,
                user: user,
                discount: user.discount,
                warning: '????n h??ng ch??a ????? ??i???u ki???n gi???m gi??!',
                noti: undefined,
            });
            return;
        }
    }

    const order = await Order.findOneAndUpdate({ _id: thisorder._id }, {
        address: req.body.address,
        status: 'shipper ??ang l???y h??ng',
        subtotal: total + 10000,
        total: total,
    });

    let noti = user.notification;
    noti = [
        ...noti,
        `B???n ???? ?????t th??nh c??ng ????n h??ng #${order._id
            .toString()
            .slice(18, 24)}!`,
    ];
    user.notification = noti;

    var score = evaluateScore(user, order.subtotal);
    var rank;

    if (score > 100 && score < 200) {
        rank = '?????ng';
    } else if (score < 300 && score > 200) {
        rank = 'b???c';
    } else {
        if (score > 300) {
            rank = 'v??ng';
        }
    }

    user.score = score;
    user.rank = rank;

    await user.save();
    res.render('cart', {
        orders: [],
        total: 0,
        subtotal: 0,
        user: req.user,
        discount: [],
        warning: undefined,
        noti: '?????t h??ng th??nh c??ng!',
    });
};

const buyFree = async(req, res) => {
    const cartItems = {
        amount: req.body.quantity,
        product: req.body.product,
        email: req.body.email,
    };
    if (!cartItems || cartItems.length < 1) {
        throw new BadRequestError('No cart items provided');
    }

    shippingFee = 0;

    let orderItems = [];

    const dbUser = await User.findOne({ _id: req.user.userId });
    const dbProduct = await Product.findOne({ _id: cartItems.product });
    if (!dbProduct) {
        throw new Error(`No product with id : ${cartItems.product}`);
    }
    const { name, price, Image, _id } = dbProduct;
    const singleOrderItem = {
        amount: cartItems.amount,
        name,
        price: 0,
        Image: Image[0],
        address: cartItems.address,
        product: _id,
        size: req.body.size,
    };

    var order;

    const existOrder = await Order.find({
        user: req.user.userId,
        status: 't??m shipper',
    });
    const len = existOrder.length;

    if (len > 0) {
        var flag = false;
        existOrder[len - 1].orderItems.forEach(item => {
            if (item.name == singleOrderItem.name && item.size == singleOrderItem.size && item.price == singleOrderItem.price) {
                flag = true;
                item.amount = parseInt(item.amount) + parseInt(singleOrderItem.amount)
            }
        })
        if (!flag) {
            orderItems = [...existOrder[len - 1].orderItems, singleOrderItem];
        } else {
            orderItems = existOrder[len - 1].orderItems
        }
        const updateOrder = await Order.findByIdAndUpdate({ _id: existOrder[len - 1]._id }, { orderItems: orderItems });
        order = updateOrder;
    } else {
        orderItems = [...orderItems, singleOrderItem]
        var total = 0;
        var subtotal = 0
        const newOrder = await Order.create({
            orderItems,
            total: total,
            subtotal: subtotal,
            shippingFee,
            phone: dbUser.phone,
            user: req.user.userId,
        });
        newOrder.save()
    }
    res.status(StatusCodes.CREATED).redirect('/KACoffe/v1/order/cart');
}

const getAllOrders = async(req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).render('reservation', {
        orders: orders,
        user: req.user,
    });
};

const getSingleOrder = async(req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`);
    }

    Permission(req.user, order.user);

    res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async(req, res) => {
    var orders = await Order.find({ user: req.user.userId }).sort({ _id: -1 });
    var user = await User.findOne({ _id: req.user.userId });

    orders = orders.filter((e) => {
        return e.status != 't??m shipper';
    });
    res.status(StatusCodes.OK).render('order', {
        orders: orders,
        userid: user._id,
        user: user,
        warning: undefined,
    });
};

const getCart = async(req, res) => {
    var orders = await Order.find({ user: req.user.userId });
    var user = await User.findOne({ _id: req.user.userId });
    var discounts = user.discount;
    var newDc = [];
    var dbDc = [];

    for (let dc of discounts) {
        const discount = await Discount.findOne({
            name: dc,
            condition1: user.rank,
        });
        if (discount) {
            if (discount.endTime < Date.now()) {
                await discount.remove();
            } else {
                newDc = [...newDc, dc];
                dbDc = [...dbDc, discount];
            }
        }
    }

    user.discount = newDc;
    await user.save();

    orders = orders.filter((e) => {
        return e.status == 't??m shipper';
    });
    if (orders.length > 0) {
        res.render('cart', {
            orders: orders[0].orderItems,
            total: orders[0].total,
            subtotal: orders[0].subtotal,
            user: user,
            discount: dbDc,
            apply: undefined,
            warning: undefined,
            noti: undefined,
        });
    } else {
        res.render('cart', {
            orders: [],
            total: 0,
            subtotal: 0,
            user: user,
            discount: [],
            warning: undefined,
            noti: undefined,
        });
    }
};

const updateOrder = async(req, res) => {
    const { id: orderId } = req.params;
    const { amount, address } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`);
    }
    Permission(req.user, order.user);

    order.amount = amount;
    order.address = address;

    await order.save();

    res.status(StatusCodes.OK).json({ order });
};

const deleteOrderItems = async(req, res) => {
    const { id } = req.params;

    var order = await Order.findOne({
        user: req.user.userId,
        status: 't??m shipper',
    });

    var total = order.total,
        subtotal = 0;
    var orderItem = order.orderItems;

    for (var i = 0; i < orderItem.length; i++) {
        if (orderItem[i]._id == id) {
            console.log(orderItem[i]);
            total -= orderItem[i].price * orderItem[i].amount;
            orderItem.splice(i, 1);
            break;
        }
    }
    subtotal = total == 0 ? 0 : total + 10000;
    console.log(orderItem, total, subtotal);

    order.orderItems = orderItem;
    order.total = total;
    order.subtotal = subtotal;

    await order.save();

    res.redirect('/KACoffe/v1/order/cart');
};

const deleteOrder = async(req, res) => {
    const { orderid } = req.params;

    let order = await Order.findOne({ _id: orderid });

    let user = await User.findOne({ _id: order.user });

    let noti = user.notification;
    let fakeid = orderid.slice(18, 24);
    noti = [...noti, `????n h??ng #${fakeid} c???a b???n ???? b??? x??a!`];
    await User.findByIdAndUpdate({ _id: order.user }, { notification: noti });

    let admin = await User.find({ role: 'admin' });
    admin.forEach(async(ad) => {
        let adNoti = ad.notification;
        adNoti = [
            ...adNoti,
            `Admin ${req.user.name} ???? x??a ????n h??ng m?? #${fakeid}!`,
        ];
        ad.notification = adNoti;
        await ad.save();
    });

    await Order.findOneAndDelete({ _id: orderid });
    res.redirect('/KACoffe/v1/admin/order');
};

const requestToDeleteOrder = async(req, res) => {
    const { orderid, userid } = req.params;
    const user = await User.findOne({ _id: userid });
    const order = await Order.findOne({ _id: orderid });

    var orders = await Order.find({ user: req.user.userId }).sort({ _id: -1 });

    orders = orders.filter((e) => {
        return e.status != 't??m shipper';
    });

    let noti = user.notification;

    if (order.status != 'shipper ??ang l???y h??ng') {
        noti = [
            ...noti,
            `Y??u c???u h???y ????n h??ng m?? #${order._id
                .toString()
                .slice(18, 24)} th???t b???i!`,
        ];
        user.notification = noti;
        await user.save();
        res.render('order', {
            orders: orders,
            userid: user._id,
            user: user,
            warning: 'Kh??ng th??? h???y ????n ???? giao ho???c ??ang giao!',
        });
        return;
    }

    noti = [
        ...noti,
        `B???n ???? g???i y??u c???u h???y ????n h??ng m?? #${order._id
            .toString()
            .slice(18, 24)}!`,
    ];
    user.notification = noti;
    await user.save();

    var admin = await User.find({ role: 'admin' });
    admin.forEach(async(ad) => {
        var adNoti = ad.notification;
        adNoti = [
            ...adNoti,
            `Kh??ch h??ng ${user.name} y??u c???u h???y ????n h??ng m?? #${order._id
                .toString()
                .slice(18, 24)}!`,
        ];
        ad.notification = adNoti;
        await ad.save();
    });
    //await User.findOneAndUpdate({role:'admin'}, {notification: noti} )
    res.redirect('/KACoffe/v1/order/myOrders');
};

const getDetailOrder = async(req, res) => {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id });
    const user = await User.findOne({ _id: req.user.userId });

    console.log(order);

    res.render('detailorder', {
        user: req.user,
        email: order.phone,
        orderid: order.id.slice(18, 24),
        orderItems: order.orderItems,
        subtotal: order.subtotal,
        address: order.address,
        status: order.status,
    });
};

const checkAccount = async(req, res) => {
    const email = req.body.email;
    const user1 = await User.findOne({ email: email });
    if (user1) {
        var discounts = user1.discount;
        var newDc = [];
        var dbDc = [];
    
        for (let dc of discounts) {
            const discount = await Discount.findOne({
                name: dc,
                condition1: user1.rank,
            });
            if (discount) {
                if (discount.endTime < Date.now()) {
                    await discount.remove();
                } else {
                    newDc = [...newDc, dc];
                    dbDc = [...dbDc, discount];
                }
            }
        }
    
        user1.discount = newDc;
        await user1.save();
    }
    
    var orders = await Order.find({ user: req.user.userId });
    var user = await User.findOne({ _id: req.user.userId });
    console.log(user.role);
    orders = orders.filter((e) => {
        return e.status == 't??m shipper';
    });

    if (!user1) {
        res.render('cart', {
            orders: orders[0] ? orders[0].orderItems : [],
            total: orders[0] ? orders[0].total : 0,
            subtotal: orders[0] ? orders[0].subtotal : 0,
            user: user,
            discount: [],
            warning: 'Email kh??ng t???n t???i!',
            noti: undefined,
        });
        return;
    }

    if (orders.length > 0) {
        console.log('cdc');
        res.render('cart', {
            orders: orders[0].orderItems,
            total: orders[0].total,
            subtotal: orders[0].subtotal,
            user: user,
            discount: dbDc,
            warning: undefined,
            noti: 'Ng?????i d??ng kh??? d???ng!',
        });
    } else {
        console.log('scscsc');
        res.render('cart', {
            orders: [],
            total: 0,
            subtotal: 0,
            user: user,
            discount: [],
            noti: 'Ng?????i d??ng kh??? d???ng!',
            warning: undefined,
        });
    }
    // res.redirect('/KACoffe/v1/order/cart')
};

const buyByAdmin = async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const orders = await Order.find({ user: req.user.userId });

    const { magiamgia } = req.body;
    const discount = await Discount.findOne({ name: magiamgia });

    const len = orders.length - 1;
    const thisorder = orders[len];
    var total = thisorder.total;

    if (thisorder.status != 't??m shipper' || thisorder.orderItems.length == 0) {
        res.render('cart', {
            orders: [],
            total: 0,
            subtotal: 0,
            user: req.user,
            discount: [],
            warning: 'Gi??? h??ng tr???ng!',
            noti: undefined,
        });
        return;
    }

    if (!user) {
        res.render('cart', {
            orders: thisorder.orderItems,
            total: thisorder.total,
            subtotal: thisorder.subtotal,
            user: req.user,
            discount: [],
            warning: 'Email kh??ng t???n t???i!',
            noti: undefined,
        });
        return;
    }

    if (discount) {
        const category = discount.category;
        if (
            discount.condition1 === user.rank &&
            thisorder.subtotal > discount.condition2
        ) {
            switch (category) {
                case 'money':
                    total -= discount.minusPrice;
                    break;
                case 'rate':
                    total = total * (1 - discount.minusPrice / 100);
                    break;
                case 'shippingfree':
                    total
                    break;
                default:
                    break;
            }
            let userDiscount = user.discount;
            userDiscount = userDiscount.filter((e) => {
                return e != magiamgia;
            });
            console.log(userDiscount);
            await User.findOneAndUpdate({ _id: req.user.userId }, { discount: userDiscount });
        } else {
            res.render('cart', {
                orders: thisorder ? thisorder.orderItems : [],
                total: thisorder ? thisorder.total : [],
                subtotal: thisorder ? thisorder.subtotal : 0,
                user: user,
                discount: user.discount,
                warning: '????n h??ng ch??a ????? ??i???u ki???n gi???m gi??!',
                noti: undefined,
            });
            return;
        }
    }

    const order = await Order.findOneAndUpdate({ _id: thisorder._id }, {
        user: user._id,
        phone: user.phone,
        address: req.body.address,
        status: 'giao th??nh c??ng',
        subtotal: total,
        total: total,
    });

    var score = evaluateScore(user, order.subtotal);
    var rank;

    if (score > 100 && score < 200) {
        rank = '?????ng';
    } else if (score < 300 && score > 200) {
        rank = 'b???c';
    } else {
        if (score > 300) {
            rank = 'v??ng';
        }
    }

    user.score = score;
    user.rank = rank;

    await user.save();

    res.render('cart', {
        orders: [],
        total: 0,
        subtotal: 0,
        user: req.user,
        discount: [],
        warning: undefined,
        noti: '?????t h??ng th??nh c??ng!',
    });
};

module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder,
    buy,
    deleteOrderItems,
    getCart,
    requestToDeleteOrder,
    deleteOrder,
    buyNotLogin,
    getDetailOrder,
    checkAccount,
    buyByAdmin,
    buyFree,
};