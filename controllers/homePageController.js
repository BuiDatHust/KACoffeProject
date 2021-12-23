const Product = require('../models/Product')
const Discount = require('../models/Discount')
const Story = require('../models/Story')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const getHomepage = async (req,res) =>{
    let productNew = await Product.find({}).sort({ _id: -1 })
    let caPhe = await Product.find({ category: 'Cà phê' }).sort({ _id: -1 })
    let traSua = await Product.find({ category: 'Trà trái cây-Trà sữa' }).sort({ _id: -1 })
    let daXay = await Product.find({ category: 'Đá xay-Choco-Matcha'}).sort({ _id: -1 })
    let doUongNhanh = await Product.find({ category: 'Đồ uống nhanh'}).sort({ _id: -1 })
    let drinks = await Product.find({ category: 'Drinks'}).sort({ _id: -1 })

    productNew = productNew.slice(0, 3)
    caPhe = caPhe.slice(0, 3)
    traSua = traSua.slice(0, 3)
    daXay = daXay.slice(0, 3)
    drinks = drinks.slice(0, 3)
    doUongNhanh = doUongNhanh.slice(0, 3)
    console.log(caPhe, traSua, daXay, drinks);

    var user

    if( req.user===undefined ){
        user = 0
    }else{
        user = req.user
        
    }

    res.status(StatusCodes.OK).renderPjax('index',{ 
        user:user,
        productNew: productNew,
        caPhe: caPhe,
        traSua: traSua,
        daXay: daXay,
        doUongNhanh: doUongNhanh,
        drinks, drinks,
        status:'' 
    })
}

const getDiscount = async (req,res) =>{
    const discount = await Discount.find({})
    discount.forEach(discount => {
        if (discount.endTime < Date.now()) {
            discount.remove()
        }
    })
    var user

    if( req.user===undefined ){
        user = 0
    }else{
        user = req.user
    }

    res.status(StatusCodes.OK).render('tracuu', {discount: discount, user: user, error: ''})
}

const getStories = async (req,res) =>{
    const stories = await Story.find({}).populate({ path: 'user', model: User, select: 'name' })
    stories.reverse()
    const page = req.query.page || 1 
    
    var user

    if( req.user===undefined ){
        user = 0
    }else{
        user = req.user
    }
    console.log(user)

    res.status(StatusCodes.OK).render('stories', { 
        stories: stories.slice((page - 1) * 6, page * 6), 
        page: parseInt(page), 
        totalPage: Math.ceil(stories.length / 6),
        user: user
    })
}

const getNotification = async (req,res) =>{
    const user = await User.findOne({ _id: req.user.userId })

    res.render('notification', { noti: user.notification, user: req.user})
}

module.exports = {
    getHomepage,
    getDiscount,
    getStories,
    getNotification
}