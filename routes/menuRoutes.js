const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    attachUser,
} = require('../middleware/authentication');

const {
    getproducts,
    getSingleProduct,
    filterProduct,
} = require('../controllers/menuController');

router.route('/:id').get(attachUser, getSingleProduct);
router.route('/').get(attachUser, getproducts);
router.route('/filter').post(attachUser, filterProduct);

module.exports = router;
