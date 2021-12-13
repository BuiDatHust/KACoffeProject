const express = require('express')

const { getAdminPage, createProductPage, createDiscountPage, deleteDiscount, createDiscount, updateDiscountPage, updateDiscount, createStory } = require('../controllers/adminController')
const { getSingleUser, saveDiscount } = require('../controllers/userController')
const { authenticateUser, authorizePermission } = require('../middleware/authentication')
const { updateProduct,deleteProduct,createProduct,getupdateProductPage } = require('../controllers/productController')
const { getAllOrders,deleteOrder } =require('../controllers/orderController')

const router = express.Router()

const multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {

      // Uploads is the Upload_folder_name
      cb(null, "./public/uploads")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now()+".jpg")
  }
})

const upload = multer({ storage: storage })


router
    .route('/')
    .get([ authenticateUser,authorizePermission('admin') ], getAdminPage)

router.route('/alluser/:id').get(authenticateUser, authorizePermission('admin'), getSingleUser);

router.route('/createStory').post([authenticateUser, authorizePermission('admin')],upload.single('image'), createStory);

router
  .route('/createDiscount')
  .get(authenticateUser, authorizePermission('admin'), createDiscountPage)
  .post(authenticateUser, authorizePermission('admin'), createDiscount)
router
  .route('/allDiscount/:id')
  .get(authenticateUser, authorizePermission('admin'), updateDiscountPage)
  .post(authenticateUser, authorizePermission('admin'), updateDiscount)
router
  .route('/allDiscount/delete/:id')
  .post(authenticateUser, authorizePermission('admin'), deleteDiscount)

router
  .route('/allproduct/:id')
  .get(authenticateUser, authorizePermission('admin'), getupdateProductPage)
  .post(authenticateUser, authorizePermission('admin'), updateProduct)
router
  .route('/allproduct/delete/:id')  
  .post(authenticateUser, authorizePermission('admin'), deleteProduct);
router
    .route('/createProduct')
    .get([authenticateUser, authorizePermission('admin')], createProductPage)   
    .post([authenticateUser, authorizePermission('admin')],upload.array('image', 4), createProduct)

router
    .route('/allOrder')
    .get(authenticateUser, authorizePermission('admin'), getAllOrders);

router.route('/deleteOrder/:orderid').post(authenticateUser, deleteOrder)

module.exports= router 