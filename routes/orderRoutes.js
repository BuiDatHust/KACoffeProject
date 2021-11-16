const express = require('express')
const router = express.Router()

const {
    authenticateUser,
    authorizePermission
} = require('../middleware/authentication')

const {
    getAllOrders,
    // getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    // updateOrder,
} = require('../controllers/orderController');

router
    .route('/')
    .post(authenticateUser, createOrder)
    .get(authenticateUser, authorizePermission('admin'), getAllOrders);

router.route('/myOrders').get(authenticateUser, getCurrentUserOrders);

//   router
//     .route('/:id')
//     .get(authenticateUser, getSingleOrder)
//     .patch(authenticateUser, updateOrder);

module.exports = router;