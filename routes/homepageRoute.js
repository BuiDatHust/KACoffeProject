const express = require('express')
const router = express.Router()

const {
    getHomepage,
    getDiscount,
    getStories,
    getReservation
} = require('../controllers/homePageController')

router.route('/').get(getHomepage)

router.route('/discount').get(getDiscount)

router.route('/stories').get(getStories)

router.route('/reservation').get(getReservation)

module.exports = router