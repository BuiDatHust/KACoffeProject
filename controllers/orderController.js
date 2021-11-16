const User = require('../models/User')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { BadrequestError } = require('../errors/badRequestError')
const { NotFoundError } = require('../errors/notFoundError')
const { Permission } = require('../utils')

const createOrder = async(req, res) => {
    const { items: cartItems } = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new BadRequestError('No cart items provided');
    }

    shippingFee = 10000;

    let orderItems = [];
    let subtotal = 0;

    const dbUser = await User.findOne({ _id: req.user.userId })

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product })
        if (!dbProduct) {
            throw new NotFoundError(
                `No product with id : ${item.product}`
            );
        }
        const { name, price, Image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            Image,
            address: item.address,
            product: _id,
        };
        // add item to order
        orderItems = [...orderItems, singleOrderItem];
        // calculate subtotal
        subtotal += item.amount * price;
    }
    // calculate total
    const total = shippingFee + subtotal;

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        shippingFee,
        phone: dbUser.phone,
        user: req.user.userId,
    });

    res
        .status(StatusCodes.CREATED)
        .json({ order });
}

const getAllOrders = async(req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
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
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async(req, res) => {
    const { id: orderId } = req.params;
    const { amount, address } = req.body

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`);
    }
    Permission(req.user, order.user);

    order.amount = amount
    order.address = address

    await order.save();

    res.status(StatusCodes.OK).json({ order });
};


module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder
}