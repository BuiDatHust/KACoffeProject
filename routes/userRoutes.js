const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermission,
    attachUser,
} = require('../middleware/authentication');
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    saveDiscount,
} = require('../controllers/userController');

router
    .route('/')
    .get(authenticateUser, authorizePermission('admin'), getAllUsers);

router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/me/update').post(authenticateUser, updateUser);
router.route('/me/updateUserPassword').post(attachUser, updateUserPassword);

// router.route('/:id').get(authenticateUser, authorizePermission('admin'), getSingleUser);

// router.route('/createStory').post(authenticateUser, authorizePermission('admin'),createStory);
// router.route('/createDiscount').post(authenticateUser, authorizePermission('admin'), createDiscount);
router.route('/saveDiscount/:id').post(authenticateUser, saveDiscount);

module.exports = router;
