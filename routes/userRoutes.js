const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermission
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
const { route } = require('express/lib/router');


router
  .route('/')
  .get(authenticateUser, authorizePermission('admin'), getAllUsers);

router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

router.route('/:id').get(authenticateUser, authorizePermission('admin'), getSingleUser);

router.route('/createStory').post(authenticateUser, createStory);
router.route('/createDiscount').post(authenticateUser, authorizePermission('admin'), createDiscount);

module.exports = router;