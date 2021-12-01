const express = require('express')
const { getAdminPage } = require('../controllers/adminController')
const { getSingleUser, createStory, createDiscount } = require('../controllers/userController')
const { authenticateUser, authorizePermission } = require('../middleware/authentication')
const { uploadImage,updateProduct,deleteProduct,createProduct } = require('../controllers/productController')
const { getAllOrders } =require('../controllers/orderController')
const router = express.Router()


router
    .route('/')
    .get([ authenticateUser,authorizePermission('admin') ], getAdminPage)

router.route('/:id').get(authenticateUser, authorizePermission('admin'), getSingleUser);

router.route('/createStory').post(authenticateUser, authorizePermission('admin'),createStory);
router.route('/createDiscount').post(authenticateUser, authorizePermission('admin'), createDiscount);

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermission('admin')], uploadImage);

router
  .route('product/:id')
  .patch([authenticateUser, authorizePermission('admin')], updateProduct)
  .delete([authenticateUser, authorizePermission('admin')], deleteProduct);
router
    .route('/product')
    .post([authenticateUser, authorizePermission('admin')], createProduct)

router
    .route('/allorder')
    .get(authenticateUser, authorizePermission('admin'), getAllOrders);

module.exports= router 