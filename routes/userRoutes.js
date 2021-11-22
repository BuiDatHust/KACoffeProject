const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermission,
    attachUser
}= require('../middleware/authentication')
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    createStory,
    createDiscount
} = require('../controllers/userController');


router
  .route('/')
  .get(authenticateUser, authorizePermission('admin'), getAllUsers);

router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/me/update').post(attachUser, updateUser);
router.route('/me/updateUserPassword').post(attachUser, updateUserPassword);

router.route('/:id').get(authenticateUser, authorizePermission('admin'), getSingleUser);

router.route('/createStory').post(authenticateUser, createStory);
router.route('/createDiscount').post(authenticateUser, authorizePermission('admin'), createDiscount);

module.exports = router;