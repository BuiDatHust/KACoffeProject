const express = require('express');
const userControllers = require('../controllers/userController');
const router = express.Router();

router.get('/:slug', userControllers.show);
router.get('/', userControllers.index);

module.exports = router;