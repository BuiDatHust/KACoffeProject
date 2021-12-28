const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermission,
} = require('../middleware/authentication');
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    uploadImage,
    updateProduct,
    deleteProduct,
    saveComment,
    deleteComment,
    editComment,
    rateProduct
} = require('../controllers/productController');

// router
//   .route('/:id')
//   // .get(getSingleProduct)
//   .patch([authenticateUser, authorizePermission('admin')], updateProduct)
//   .delete([authenticateUser, authorizePermission('admin')], deleteProduct);
router.route('/saveComment').post(authenticateUser, saveComment);
router.route('/:productId/deleteComment/:commentId').post(authenticateUser, deleteComment);
router.route('/:productId/editComment/:commentId').post(authenticateUser, editComment);
router.route('/rateProduct/:productId').post(rateProduct);

router
    .route('/')
    // .post([authenticateUser, authorizePermission('admin')], createProduct)
    .get(getAllProducts);

// router
//   .route('/uploadImage')
//   .post([authenticateUser, authorizePermission('admin')], uploadImage);

module.exports = router;