const express = require('express')
const router = express.Router()

const {
    authenticateUser,
    authorizePermission,
    attachUser
} = require('../middleware/authentication')

const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
    buy
} = require('../controllers/orderController');

router
    .route('/')
    .post(attachUser, createOrder)
    .get(authenticateUser,
        authorizePermission('admin'),
        getAllOrders);


router.route('/myOrders').get(authenticateUser, getCurrentUserOrders);


router.route('/myOrders').get(authenticateUser, getCurrentUserOrders);

router.route('/buy').post(authenticateUser, buy);

router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder);