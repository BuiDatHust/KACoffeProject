const express = require('express')
const router = express.Router()

const { register,login,logout,forgotPassword } = require('../controllers/authController')

router.get('/', (req,res) =>{
    res.render('auth/login', {user: req.user, warning: undefined})
})
router.get('/register', (req,res) => {
    res.render('auth/register', {user: req.user, warning: undefined})
})
router.get('/forgot-password', (req,res) => {
    res.render('auth/forgot-password', {user: req.user, warning: undefined})
})
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgot-password', forgotPassword)

module.exports= router ;