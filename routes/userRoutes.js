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
    updateUserPassword
} = require('../controllers/userController')


router
  .route('/')
  .get(authenticateUser, authorizePermission('admin'), getAllUsers);

router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

router.route('/:id').get(authenticateUser, authorizePermission('admin'), getSingleUser);

module.exports = router;