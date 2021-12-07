const Product = require('../models/Product')
const Discount = require('../models/Discount')
const Story = require('../models/Story')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const getHomepage = async (req,res) =>{
    const product = await Product.find({})
    var user

    if( req.user===undefined ){
        user = 0
    }else{
        user = req.user
    }
    console.log(user)

    res.status(StatusCodes.OK).render('index',{ user:user })
}

const getDiscount = async (req,res) =>{
    const discount = await Discount.find({})
    var user

    if( req.user===undefined ){
        user = 0
    }else{
        user = req.user
    }

    res.status(StatusCodes.OK).render('tracuu', {discount: discount, user: user})
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
module.exports = {
    getHomepage,
    getDiscount,
    getStories
}