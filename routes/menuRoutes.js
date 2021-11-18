const express = require('express')
const router = express.Router()

const {
    getproducts,
} = require('../controllers/menuController')

router.route('/').get(getproducts)

module.exports = router