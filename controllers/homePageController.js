const Product = require('../models/Product')
const Discount = require('../models/Discount')
const Story = require('../models/Story')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const getHomepage = async (req,res) =>{
    const product = await Product.find({})
    const user = req.user
    res.status(StatusCodes.OK).render('index', { user: user})
}

const getDiscount = async (req,res) =>{
    const discount = await Discount.find({})
    res.status(StatusCodes.OK).json({ discount })
}

const getStories = async (req,res) =>{
    const stories = await Story.find({}).populate({ path: 'user', model: User, select: 'name' })
    const page = req.query.page || 1 
    res.status(StatusCodes.OK).render('stories', { 
        stories: stories.slice((page - 1) * 6, page * 6), 
        page: parseInt(page), 
        totalPage: Math.ceil(stories.length / 6)
    })
}
module.exports = {
    getHomepage,
    getDiscount,
    getStories
}