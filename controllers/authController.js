const User = require('../models/User')
const {  StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/badRequestError')
const UnauthentiatedError = require('../errors/unauthenticatedError')
const { attachTokenToRes,createTokenUser } = require('../utils')
const nodemailer = require('nodemailer')
const randomString = require('randomstring')

const register = async (req,res) =>{
    const { email,name,password,phone } = req.body;

    const emailExists= await User.findOne({ email })
    if( emailExists ){
        res.render('auth/register', { 
            user: req.user, 
            warning: 'Email đã được sử dụng, vui lòng thử email khác!' })
        return
    }

    const isFirstAccount = (await User.countDocuments({}) ) ==0
    const role = isFirstAccount ? 'admin' : 'user'

    const user = await User.create({ name,email,password,role,phone })
    await user.save()
    const tokenUser = createTokenUser(user)
    attachTokenToRes({res,user: tokenUser})
    res.status(StatusCodes.CREATED).render('index',{user: tokenUser});

}

const login = async (req,res) =>{
    const { email,password } = req.body 
    if( !email || !password ) {
        res.render('auth/login', { user: req.user, warning: 'Vui lòng nhập email hoặc mật khẩu!' })
        return
    }

    user = await User.findOne({email}) 
    if( !user ) {
        res.render('auth/login', { user: req.user, warning: 'Tài khoản không tồn tại!' })
        return
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if( !isPasswordCorrect ) {
        res.render('auth/login', { user: req.user, warning: 'Mật khẩu không đúng!' })
        return
    }
    const tokenUser = createTokenUser(user)
    attachTokenToRes({res, user: tokenUser})
    res.status(StatusCodes.OK).render('index', {user: tokenUser})
}

const logout = async (req, res) => {
    // res.cookie('token', 'logout', {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 500),
    // }); 
    res.clearCookie('token')
    res.status(StatusCodes.OK).redirect('/KACoffe/v1/');
  };

const forgotPassword = async (req,res) => {
    const email = req.body.email;
    const newPassword = randomString.generate(8)
    console.log(newPassword)
    if(!email) {
        res.render('auth/forgot-password', { user: req.user, warning: 'Vui lòng nhập email!' })
        return
    }
    user = await User.findOne({ email })
    if(!user) {
        res.render('auth/forgot-password', { user: req.user, warning: 'Không tồn tại tài khoản với email này!' })
        return
    }
    user.password = newPassword
    await user.save()

    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
    const mailOptions = {
        from: '"KaCoffee" <ka.coffee.hust@outlook.com>',
        to: email,
        subject: "Thiết lập lại mật khẩu!", 
        html: "<b>Mật khẩu mới: </b>" + newPassword, 
    }
    transporter.sendMail(mailOptions, function(err,info) {
        if (err) {
            console.log(err)
            return;
        }
        console.log("Sent: " + info.response);
    });
    res.status(StatusCodes.OK).redirect('/KACoffe/v1/auth')
}

module.exports = { register,login, logout, forgotPassword }