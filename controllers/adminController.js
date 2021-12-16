const { NotFoundError } = require("../errors");
const Discount = require("../models/Discount");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Story = require("../models/Story");
const User = require("../models/User");
var ObjectId = require('mongodb').ObjectID;

const createProductPage =async (req,res) =>{
    res.render('addProduct', { user: req.user })
}

const createDiscountPage = async (req,res) => {
    res.render('addDiscount', { user: req.user, discount: 0, warning: undefined })
}
  
const createDiscount = async (req,res) => {
    const newDiscount = req.body
    if (newDiscount.startTime >= newDiscount.endTime) {
        res.render('addDiscount', { user: req.user, discount: newDiscount, warning: "Thời gian không hợp lệ!" })
        return
    }
    const discount = await Discount.create( newDiscount )
    if (discount.endTime < Date.now()) {
        discount.remove()
        res.render('addDiscount', { user: req.user, discount: newDiscount, warning: "Mã giảm giá đã hết hạn!" })
        return
    }
    res.redirect('/KACoffe/v1/admin')
}

const updateDiscountPage = async (req,res) => {
    const { id: discountId } = req.params
    const discount = await Discount.findOne({ _id: discountId });
    res.render('updateDiscount', { user: req.user, discount: discount })
}

const updateDiscount = async (req,res) => {
    const { id: discountId } = req.params
    var update = req.body ;
    var updateForm = {};
    
    Object.keys(update).forEach(key =>{
      if( update[key] ){
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
const updateRoleUserAsAdmin = async(req, res) => {
    const {id : userId} = req.params
    const user = await User.findOne({_id: userId});
    const update1 = user
    update1.role = 'admin'
    if(!user){
        throw new NotFoundError(`No user with id: ${userId}`);
    }
    await User.findOneAndUpdate({_id: userId}, update1, {
        new : true
    })
    res.redirect('/KACoffe/v1/admin');
}
const createStoryPage = async (req, res) => {
    res.render('addStories', { user: req.user })
}

const getUpdateStoryPage = async (req,res) =>{
    res.render('updateStories', { user: req.user })
}

const createStory = async (req,res) => {
    req.body.user = req.user.userId
    console.log(req.file)
    const length = req.file.destination.length
    req.body.image =  req.file.destination.slice(8,length) +'/'+ req.file.filename ;
    
    const story = await Story.create(req.body)
    res.redirect('/KACoffe/v1/admin')
}

const updateStory =async (req,res) =>{
    const {id:storyId}= req.params 
    const { name,description,detaildescription } = req.body

    const story =await Story.findOneAndUpdate({ _id: storyId }, { name: name, description:description,detaildescription: detaildescription })
    res.redirect('/KACoffe/v1/admin')
}

const getAdminPage = async (req,res) =>{
    const product = await Product.find({})
    const story = await Story.find({})
    const discount = await Discount.find({})
    const order = await Order.find({})
    const users = await User.find({})
    const user = await User.findOne({_id: req.user.userId})

    story.reverse()
    discount.reverse()
    order.reverse()

    let rate =[0,0,0,0,0,0]
    let avenue=0,sumorder=0 ,newcustomer=0 ,sum=0

    const orderItem = order.map((e)=>{
        return e.orderItems
    })
    
    orderItem.forEach( (e)=>{
        e.forEach(async (f) =>{
            console.log(f)
            const product = await Product.findOne({_id: f.product})
            
            if( product.category=="Nổi bật" ){
                rate[0]+= 1 
            }else if( product.category=="Cà phê"){
                console.log('cdcdc')
                rate[1]+=1
            }else if( product.category=="Trà trái cây-Trà sữa"){
                rate[2]+=1
            }else if( product.category=='Đá xay-Choco-Matcha'){
                rate[3]+=1
            }else if( product.category=="Đồ uống nhanh" ){
                rate[4]+=1
            }else {
                rate[5] +=1
            }
            sum+=1
        })
    })
    console.log(rate)
    // for(var i of rate){
    //     i = i/sum
    // }

   
    
    order.forEach(function(e){
        if( e.createdAt.getFullYear() >=2021){
            avenue += e.subtotal;
            sumorder+=1 ;

            if( e.user==undefined ){
                newcustomer+=1
            }
        }
        
    })

    users.forEach(function(e){
        if( e.createdAt.getFullYear() >=2021 ){
            newcustomer+=1
        }
    })

    console.log(avenue,sumorder,newcustomer)
    discount.forEach(discount => {
        if (discount.endTime < Date.now()) {
            discount.remove()
        }
    })
    avenue= +(avenue/1000000).toFixed(2)

    res.render('admin', { 
        user: user, 
        products: product,
        stories: story ,
        discounts:discount,
        orders: order,
        users: users,
        chart: { avenue,sumorder,newcustomer },
        rate:rate.join(" ")
    });
}


module.exports = {
    getAdminPage ,
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
    updateStory
}