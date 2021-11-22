const User = require('../models/User')
const Order= require('../models/Order')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { BadrequestError } =require('../errors/badRequestError')
const { NotFoundError } = require('../errors/notFoundError')
const { Permission} = require('../utils')

const createOrder = async (req,res) =>{
  if( req.user!==undefined ){
  const cartItems= {
    amount: req.body.quantity,
    product: req.body.product
  };

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError('No cart items provided');
  }

  shippingFee = 10000;

  let orderItems = [];
  var subtotal 

  const dbUser = await User.findOne({ _id: req.user.userId })
    const dbProduct = await Product.findOne({ _id: cartItems.product })
    if (!dbProduct) {
      throw new Error(
        `No product with id : ${cartItems.product}`
      );
    }
    const { name, price, Image, _id } = dbProduct;
    const singleOrderItem = {
      amount: cartItems.amount,
      name,
      price,
      Image,
      address:cartItems.address,
      product: _id,
    };

  var order
  
  const existOrder = await Order.find({ user: req.user.userId })
  
  if( !existOrder.length==0 ){
    console.log("xss")
    orderItems = [...existOrder[0].orderItems, singleOrderItem]

    total = existOrder[0].total +singleOrderItem.price*singleOrderItem.amount
    subtotal = total+ shippingFee;

    const updateOrder = await Order.findByIdAndUpdate({_id:existOrder[0]._id}, 
      { orderItems: orderItems, subtotal: subtotal, total: total})
    order= updateOrder
  }else{
    total= singleOrderItem.price*singleOrderItem.amount
    subtotal = total+shippingFee
    orderItems = [...orderItems, singleOrderItem]

  const newOrder = await Order.create({
    orderItems,
    total :total,
    subtotal: subtotal,
    shippingFee,
    phone: dbUser.phone,
    user: req.user.userId,
  });
  order= newOrder
}

if( req.user!==undefined ){
  var orders = await Order.find({ user: req.user.userId });
  res
    .status(StatusCodes.CREATED)
    .render('cart',{orders:orders[0].orderItems, subtotal: orders[0].subtotal});
}else{
  res
    .status(StatusCodes.CREATED)
    .render('index', { user:'' });
}}else{
  const { phone,name,amount,address,nameproduct } = req.body
  var subtotal=0, total =0

  const product = await Product.findOne({ name: nameproduct })
  console.log(product)
  var orderItems = [{
    name: name,
    price: product.price,
    amount: amount
  }]
  total =product.price* amount
  subtotal=total+ 20000

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    address,
    phone
  })
  res.json({yourOrder:order})
}

}

const buy = async (req,res) =>{
  console.log(req.body.address)
  const order=await Order.findOneAndUpdate({ user: req.user.userId }, { 
        address: req.body.address ,
        status: "shipper đang lấy hàng"
      })
  res.render('index', {order:order})
}

const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).render('reservation', {orders: orders , user: req.user});
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
    var orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).render('cart', { orders:orders[0].orderItems, subtotal: orders[0].subtotal });
};

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params
    const { amount,address } = req.body 
    
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


module.exports ={
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder,
    buy
}