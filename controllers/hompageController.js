const Product = require('../models/Product')
const Discount = require('../models/Discount')
const Story = require('../models/Story')
const { StatusCodes } = require('http-status-codes')

const getHomepage = async (req,res) =>{
    const product = await Product.find({})
    res.status(StatusCodes.OK).json({ product })
}

const getDiscount = async (req,res) =>{
    const discount = await Discount.find({})
    res.status(StatusCodes.OK).json({ discount })
}

const getStories = async (req,res) =>{
    const stories = await Story.find({})
    res.status(StatusCodes.OK).json({ stories })
}

module.exports = {
    getHomepage,
    getDiscount,
    getStories
}