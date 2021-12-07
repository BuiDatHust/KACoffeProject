const express = require('express')
const router = express.Router()
const {authenticateUser,attachUser} = require('../middleware/authentication')

const {
    getproducts, getSingleProduct,
} = require('../controllers/menuController')

router.route('/:id').get(attachUser,getSingleProduct)
router.route('/').get(attachUser,getproducts)

module.exports = router