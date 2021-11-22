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
<<<<<<< HEAD
} = require('../controllers/orderController');

router
=======
    buy
  } = require('../controllers/orderController');
  
  router
>>>>>>> main
    .route('/')
    .post(attachUser, createOrder)
    .get(authenticateUser, authorizePermission('admin'), getAllOrders);

<<<<<<< HEAD
router.route('/myOrders').get(authenticateUser, getCurrentUserOrders);

router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder);

module.exports = router;
=======
  
  router.route('/myOrders').get(authenticateUser, getCurrentUserOrders);

  router.route('/buy').post(authenticateUser, buy);
  
  router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder);
  

  
  module.exports = router;
>>>>>>> main
