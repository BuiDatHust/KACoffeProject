const User = require('../models/User')
const {  StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/badRequestError')
const UnauthentiatedError = require('../errors/unauthenticatedError')
const { attachTokenToRes,createTokenUser } = require('../utils')

const register = async (req,res) =>{
    const { email,name,password,phone } = req.body;

    const emailExists= await User.findOne({ email })
    if( emailExists ){
        throw new BadRequestError("Email Exists !!")
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
        throw new BadRequestError("Please provide email or password!!")
    }

    user = await User.findOne({email}) 
    if( !user ) {
        throw new UnauthentiatedError("Not Exist this user!!")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if( !isPasswordCorrect ) {
        throw new UnauthentiatedError("Not Exist this user!!")
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

module.exports = { register,login, logout }