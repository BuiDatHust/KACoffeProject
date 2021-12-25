const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/badRequestError');
const { NotFoundError } = require('../errors/notFoundError');
const { Permission } = require('../utils');
const Discount = require('../models/Discount');
var nodeMailer = require('nodemailer');

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

const createOrder = async (req, res) => {
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

        const existOrder = await Order.find({ user: req.user.userId });
        const len = existOrder.length;
        if (
            !existOrder.length == 0 &&
            existOrder[len - 1].status == 'tìm shipper'
        ) {
            console.log('xss');

            orderItems = [...existOrder[len - 1].orderItems, singleOrderItem];

            total =
                existOrder[len - 1].total +
                singleOrderItem.price * singleOrderItem.amount;
            subtotal = total + shippingFee;
            const updateOrder = await Order.findByIdAndUpdate(
                { _id: existOrder[len - 1]._id },
                { orderItems: orderItems, subtotal: subtotal, total: total }
            );
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
        const product = await Product.findOne({ _id: req.body.product })
        res.render('detail', {
            user: 0,
            product: product,
            warning: "Vui lòng đăng nhập để thêm vào giỏ hàng!"
        })
    }
};

const buyNotLogin = async (req, res) => {
    var { phone, name, amount, address, nameproduct, email, size } = req.body;
    var subtotal = 0,
        total = 0;

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

    let product = await Product.findOne({ name: nameproduct });

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
            status: 'Không tìm thấy sản phẩm này',
        });
        return;
    }
    orderItems = [
        {
            name: nameproduct,
            price: product.price,
            amount: amount,
            size: size,
            product: product._id,
        },
    ];
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
        subject: 'Chúc mừng bạn có đơn hàng đầu tiên',
        html: '<b>Chúc mừng bạn có đơn hàng đầu tiên: </b> Hãy đăng nhập để có thể hưởng thêm ưu đãi',
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Sent: ' + info.response);
    });

    const order = await Order.create({
        status: 'shipper đang lấy hàng',
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
        status: 'Đặt hàng thành công',
    });
};

const buy = async (req, res) => {
    const orders = await Order.find({
        user: req.user.userId,
        status: 'tìm shipper',
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
            warning: 'Bạn chưa nhập địa chỉ!',
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
            warning: 'Giỏ hàng trống!',
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
            await User.findOneAndUpdate(
                { _id: req.user.userId },
                { discount: userDiscount }
            );
        } else {
            res.render('cart', {
                orders: thisorder ? thisorder.orderItems : [],
                total: thisorder ? thisorder.total : [],
                subtotal: thisorder ? thisorder.subtotal : 0,
                user: user,
                discount: user.discount,
                warning: 'Đơn hàng chưa đủ điều kiện giảm giá!',
                noti: undefined,
            });
            return;
        }
    }

    const order = await Order.findOneAndUpdate(
        { _id: thisorder._id },
        {
            address: req.body.address,
            status: 'shipper đang lấy hàng',
            subtotal: total + 10000,
            total: total,
        }
    );

    let noti = user.notification;
    noti = [
        ...noti,
        `Bạn đã đặt thành công đơn hàng #${order._id
            .toString()
            .slice(18, 24)}!`,
    ];
    user.notification = noti;

    var score = evaluateScore(user, order.subtotal);
    var rank;

    if (score > 100 && score < 200) {
        rank = 'đồng';
    } else if (score < 300 && score > 200) {
        rank = 'bạc';
    } else {
        if (score > 300) {
            rank = 'vàng';
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
        noti: 'Đặt hàng thành công!',
    });
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).render('reservation', {
        orders: orders,
        user: req.user,
    });
};

const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`);
    }

    Permission(req.user, order.user);

    res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
    var orders = await Order.find({ user: req.user.userId }).sort({ _id: -1 });
    var user = await User.findOne({ _id: req.user.userId });

    orders = orders.filter((e) => {
        return e.status != 'tìm shipper';
    });
    res.status(StatusCodes.OK).render('order', {
        orders: orders,
        userid: user._id,
        user: user,
        warning: undefined,
    });
};

const getCart = async (req, res) => {
    var orders = await Order.find({ user: req.user.userId });
    var user = await User.findOne({ _id: req.user.userId });
    var discounts = user.discount;
    var newDc = [];

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
            }
        }
    }

    user.discount = newDc;
    await user.save();

    orders = orders.filter((e) => {
        return e.status == 'tìm shipper';
    });
    if (orders.length > 0) {
        res.render('cart', {
            orders: orders[0].orderItems,
            total: orders[0].total,
            subtotal: orders[0].subtotal,
            user: user,
            discount: user.discount,
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

const updateOrder = async (req, res) => {
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

const deleteOrderItems = async (req, res) => {
    const { id } = req.params;

    var order = await Order.findOne({
        user: req.user.userId,
        status: 'tìm shipper',
    });

    var total = order.total,
        subtotal = 0;
    var orderItem = order.orderItems;

    for (var i = 0; i < orderItem.length; i++) {
        if (orderItem[i]._id == id) {
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

const deleteOrder = async (req, res) => {
    const { orderid } = req.params;

    let order = await Order.findOne({ _id: orderid });

    let user = await User.findOne({ _id: order.user });

    let noti = user.notification;
    let fakeid = orderid.slice(18, 24);
    noti = [...noti, `Đơn hàng #${fakeid} của bạn đã bị xóa!`];
    await User.findByIdAndUpdate({ _id: order.user }, { notification: noti });

    let admin = await User.find({ role: 'admin' });
    admin.forEach(async (ad) => {
        let adNoti = ad.notification;
        adNoti = [
            ...adNoti,
            `Admin ${req.user.name} đã xóa đơn hàng mã #${fakeid}!`,
        ];
        ad.notification = adNoti;
        await ad.save();
    });

    await Order.findOneAndDelete({ _id: orderid });
    res.redirect('/KACoffe/v1/admin/order');
};

const requestToDeleteOrder = async (req, res) => {
    const { orderid, userid } = req.params;
    const user = await User.findOne({ _id: userid });
    const order = await Order.findOne({ _id: orderid });

    var orders = await Order.find({ user: req.user.userId }).sort({ _id: -1 });

    orders = orders.filter((e) => {
        return e.status != 'tìm shipper';
    });

    let noti = user.notification;

    if (order.status != 'shipper đang lấy hàng') {
        noti = [
            ...noti,
            `Yêu cầu hủy đơn hàng mã #${order._id
                .toString()
                .slice(18, 24)} thất bại!`,
        ];
        user.notification = noti;
        await user.save();
        res.render('order', {
            orders: orders,
            userid: user._id,
            user: user,
            warning: 'Không thể hủy đơn đã giao hoặc đang giao!',
        });
        return;
    }

    noti = [
        ...noti,
        `Bạn đã gửi yêu cầu hủy đơn hàng mã #${order._id
            .toString()
            .slice(18, 24)}!`,
    ];
    user.notification = noti;
    await user.save();

    var admin = await User.find({ role: 'admin' });
    admin.forEach(async (ad) => {
        var adNoti = ad.notification;
        adNoti = [
            ...adNoti,
            `Khách hàng ${user.name} yêu cầu hủy đơn hàng mã #${order._id
                .toString()
                .slice(18, 24)}!`,
        ];
        ad.notification = adNoti;
        await ad.save();
    });
    //await User.findOneAndUpdate({role:'admin'}, {notification: noti} )
    res.redirect('/KACoffe/v1/order/myOrders');
};

const getDetailOrder = async (req, res) => {
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

const checkAccount = async (req, res) => {
    const email = req.body.email;
    const user1 = await User.findOne({ email: email });
    var discounts = user1.discount;
    var newDc = [];
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
            }
        }
    }

    user1.discount = newDc;
    await user1.save();

    var orders = await Order.find({ user: req.user.userId });
    var user = await User.findOne({ _id: req.user.userId });
    console.log(user.role);
    orders = orders.filter((e) => {
        return e.status == 'tìm shipper';
    });

    if (!user1) {
        res.render('cart', {
            orders: orders[0] ? orders[0].orderItems : [],
            total: orders[0] ? orders[0].total : 0,
            subtotal: orders[0] ? orders[0].subtotal : 0,
            user: user,
            discount: [],
            warning: 'Email không tồn tại!',
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
            discount: user1.discount,
            warning: undefined,
            noti: 'Người dùng khả dụng!',
        });
    } else {
        console.log('scscsc');
        res.render('cart', {
            orders: [],
            total: 0,
            subtotal: 0,
            user: user,
            discount: [],
            noti: 'Người dùng khả dụng!',
            warning: undefined,
        });
    }
    // res.redirect('/KACoffe/v1/order/cart')
};

const buyByAdmin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const orders = await Order.find({ user: req.user.userId });

    const { magiamgia } = req.body;
    const discount = await Discount.findOne({ name: magiamgia });

    const len = orders.length - 1;
    const thisorder = orders[len];
    var total = thisorder.total;

    if (thisorder.status != 'tìm shipper' || thisorder.orderItems.length == 0) {
        res.render('cart', {
            orders: [],
            total: 0,
            subtotal: 0,
            user: req.user,
            discount: [],
            warning: 'Giỏ hàng trống!',
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
            warning: 'Email không tồn tại!',
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
            await User.findOneAndUpdate(
                { _id: req.user.userId },
                { discount: userDiscount }
            );
        } else {
            res.render('cart', {
                orders: thisorder ? thisorder.orderItems : [],
                total: thisorder ? thisorder.total : [],
                subtotal: thisorder ? thisorder.subtotal : 0,
                user: user,
                discount: user.discount,
                warning: 'Đơn hàng chưa đủ điều kiện giảm giá!',
                noti: undefined,
            });
            return;
        }
    }

    const order = await Order.findOneAndUpdate(
        { _id: thisorder._id },
        {
            user: user._id,
            phone: user.phone,
            address: req.body.address,
            status: 'giao thành công',
            subtotal: total,
            total: total,
        }
    );

    var score = evaluateScore(user, order.subtotal);
    var rank;

    if (score > 100 && score < 200) {
        rank = 'đồng';
    } else if (score < 300 && score > 200) {
        rank = 'bạc';
    } else {
        if (score > 300) {
            rank = 'vàng';
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
        noti: 'Đặt hàng thành công!',
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
};
