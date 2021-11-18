const Product = require('../models/Product')
// const Discount = require('../models/Discount')
const { StatusCodes } = require('http-status-codes')

const getproducts = async (req, res) => {
    const products = await Product.find({})
        .then(products => {
            products = products.map(products => products.toObject())
            res.status(StatusCodes.OK).render('menu',{
                products: products
            })
        })
    
}
module.exports = {
    getproducts
}