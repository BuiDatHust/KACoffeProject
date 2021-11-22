const express = require('express')
const router = express.Router()

const {
    getHomepage,
    getDiscount,
    getStories,
} = require('../controllers/homePageController')
const { attachUser } = require('../middleware/authentication')

router.route('/').get(attachUser, getHomepage)

router.route('/discount').get(attachUser, getDiscount)

router.route('/stories').get(attachUser, getStories)

module.exports = router