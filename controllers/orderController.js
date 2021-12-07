const User = require('../models/User')
const Order= require('../models/Order')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } =require('../errors/badRequestError')
const { NotFoundError } = require('../errors/notFoundError')
const { Permission} = require('../utils')
const Discount = require('../models/Discount')

const evaluateScore = (user, subtotal) =>{
  var score=user.score
  if( subtotal>50000 && subtotal<10000 ){
    score +=1
  }else if( subtotal>100000 && subtotal<400000 ){
    score +=5
  }else{
    score +=10
  }

  return score 
}

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
      Image:Image[0],
      address:cartItems.address,
      product: _id,
    };

  var order
  
  const existOrder = await Order.find({ user: req.user.userId })
  const len = existOrder.length
  if( !existOrder.length==0 && existOrder[len-1].status=='tìm shipper' ){
    console.log("xss")
    
    orderItems = [...existOrder[len-1].orderItems, singleOrderItem]

    total = existOrder[len-1].total +singleOrderItem.price*singleOrderItem.amount
    subtotal = total+ shippingFee;

    const updateOrder = await Order.findByIdAndUpdate({_id:existOrder[len-1]._id}, 
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

  var userdiscount = dbUser.discount

  var score = evaluateScore(dbUser, subtotal)
  var rank 

  if( score>100 && score<200 ){
    rank = "đồng"
  }else if( score<300 && score>200 ){
    rank = "bạc"
  }else{
    if( score>300 ){
      rank= "vàng"
    }
  }

  const user = await User.findByIdAndUpdate({ _id:req.user.userId }, { score:score , rank:rank })
  
  res
    .status(StatusCodes.CREATED)
    .render('cart',{
      orders:orders[0].orderItems, 
      subtotal: orders[0].subtotal, 
      discount:userdiscount});
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
  const orders = await Order.find({ user: req.user.userId })
  const user = await User.findOne({ _id:req.user.userId })
  const { magiamgia } = req.body
  const discount = await Discount.findOne({ name: magiamgia })

  const len= orders.length-1
  const thisorder = orders[len]
  console.log(thisorder)
  var total = thisorder.total

  const category = discount.category

  if( discount.condition1 === user.rank && thisorder.subtotal>discount.condition2 ){
    switch (category) 
    {
      case "money":

        total -= discount.minusPrice
        break
      case "rate": 
        total = total*(1-discount.minusPrice/100)
        break
      case "shippingfree":
        total-=10000
        break
      default:
        break
    }
     
}else{
  throw new Error("Dont have enough condition")
}

  const order=await Order.findOneAndUpdate({ _id: thisorder._id }, { 
        address: req.body.address ,
        status: "shipper đang lấy hàng",
        subtotal: total+10000,
        total: total
      })
  res.render('index', {order:order, user:user})
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
    var user = await User.findOne({ _id: req.user.userId })
    
    orders = orders.filter((e) => {
      return e.status!="tìm shipper"
    } );

    res.status(StatusCodes.OK).render('order', { orders:orders });
};

const getCart = async (req,res) =>{
  var orders = await Order.find({ user: req.user.userId });
  var user = await User.findOne({ _id: req.user.userId })

  orders = orders.filter((e) => {
    return e.status=="tìm shipper"
  } );

  if( orders.length>0 ){
    console.log("cdc")
    res.render('cart', { orders: orders[0].orderItems,subtotal: orders[0].subtotal ,user:user,discount: user.discount })
  }else{
    res.redirect('/KACoffe/v1/order/cart');
  }
  
}

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

const deleteOrderItems = async (req,res) =>{
  const { id } = req.params
  
  var order = await Order.findOne({ user: req.user.userId })
  var total= order.total, subtotal=0
  order = order.orderItems

  for(var i=0 ;i<order.length; i++){
    if( order[i]._id ==id ){
      order.splice(i,1)
      total -= order[i].price  * order[i].amount 
    }
  
  }
  subtotal = total+10000
  console.log(subtotal)
  
  const updateOrder = await Order.findOneAndUpdate({ user: req.user.userId }, { 
    orderItems: order, total: total, subtotal: subtotal
  })
  res.render('cart', { orders: order ,subtotal: subtotal})

}


module.exports ={
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder,
    buy,
    deleteOrderItems,
    getCart,
}