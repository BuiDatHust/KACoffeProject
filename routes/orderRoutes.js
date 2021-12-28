const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    authorizePermission,
    attachUser,
} = require('../middleware/authentication');

const {
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
    buy,
    getCart,
    deleteOrderItems,
    requestToDeleteOrder,
    buyNotLogin,
    getDetailOrder,
    buyByAdmin,
    checkAccount,
    buyFree
} = require('../controllers/orderController');

router.route('/').post(attachUser, createOrder);
router.route('/buyfree').post(attachUser, buyFree);
// .get(authenticateUser, authorizePermission('admin'), getAllOrders);

router.route('/orderNotLogin').post(attachUser, buyNotLogin);

router.route('/myOrders').get(authenticateUser, getCurrentUserOrders);
router.route('/cart').get(authenticateUser, getCart);

router.route('/buy').post(authenticateUser, buy);
router.route('/buyByAdmin').post(authenticateUser, buyByAdmin);
router.route('/check').post(authenticateUser, checkAccount);

router.route('/detail/:id').get(authenticateUser, getDetailOrder);

router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder);

router.route('/delete/:id').post(authenticateUser, deleteOrderItems);

router
    .route('/sendNotification/:orderid/:userid')
    .post(authenticateUser, requestToDeleteOrder);


module.exports = router;