const express = require('express')
const router = express.Router()

const { register,login,logout,forgotPassword } = require('../controllers/authController')

router.get('/', (req,res) =>{
    res.render('auth', {user: req.user})
})
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgot-password', forgotPassword)

module.exports= router ;