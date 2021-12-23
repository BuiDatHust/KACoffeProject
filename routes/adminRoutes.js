const express = require('express')

const {
    getAdminPage,
    createProductPage,
    createDiscountPage,
    deleteDiscount,
    createDiscount,
    updateDiscountPage,
    updateDiscount,
    createStory,
    updateRoleUserAsAdmin,
    createStoryPage,
    getUpdateStoryPage,
    updateStory,
    deleteStory,
    updateOrder,
    getAdminDiscountPage,
    getAdminUserPage,
    getAdminOrderPage,
    getAdminStoriesPage,
    getAdminStatisticPage
} = require('../controllers/adminController')
const { getSingleUser, saveDiscount } = require('../controllers/userController')
const { authenticateUser, authorizePermission } = require('../middleware/authentication')
const { updateProduct, deleteProduct, createProduct, getupdateProductPage } = require('../controllers/productController')
const { getAllOrders, deleteOrder } = require('../controllers/orderController')

const router = express.Router()

const multer = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        // Uploads is the Upload_folder_name
        cb(null, "./public/uploads")
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})

const upload = multer({ storage: storage })


router
    .route('/')
    .get([authenticateUser, authorizePermission('admin')], getAdminPage)
router
    .route('/discount')
    .get([authenticateUser, authorizePermission('admin')], getAdminDiscountPage)
router
    .route('/user')
    .get([authenticateUser, authorizePermission('admin')], getAdminUserPage)
router
    .route('/order')
    .get([authenticateUser, authorizePermission('admin')], getAdminOrderPage)
router
    .route('/stories')
    .get([authenticateUser, authorizePermission('admin')], getAdminStoriesPage)
router
    .route('/statistic')
    .get([authenticateUser, authorizePermission('admin')], getAdminStatisticPage)

router.route('/alluser/:id').get(authenticateUser, authorizePermission('admin'), getSingleUser);

router.route('/createStory').post(authenticateUser, authorizePermission('admin'), createStory);
router.route('/updateUserAsAdmin/:id').post(authenticateUser, authorizePermission('admin'), updateRoleUserAsAdmin)
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
    .post([authenticateUser, authorizePermission('admin')], upload.array('image', 4), createProduct)

router.route('/deleteStory/:id')
    .post([authenticateUser, authorizePermission('admin')], deleteStory)
router.route('/createStories')
    .get([authenticateUser, authorizePermission('admin')], createStoryPage)
    .post([authenticateUser, authorizePermission('admin')], upload.single('image', 1), createStory)
router.route('/updateStory/:id')
    .get([authenticateUser, authorizePermission('admin')], getUpdateStoryPage)
    .post([authenticateUser, authorizePermission('admin')], upload.single('image', 1), updateStory)

router
    .route('/allOrder')
    .get(authenticateUser, authorizePermission('admin'), getAllOrders);
router.route('/updateOrder/:id')
    .post(authenticateUser, authorizePermission('admin'), updateOrder)

router.route('/deleteOrder/:orderid').post(authenticateUser, deleteOrder)

module.exports = router