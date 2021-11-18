const express = require('express')
const router = express.Router()

const {
    getHomepage,
    getDiscount,
    getStories,
} = require('../controllers/homePageController')

router.route('/').get(getHomepage)

router.route('/discount').get(getDiscount)

router.route('/stories').get(getStories)

module.exports = router
