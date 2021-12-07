const User = require('../models/User')
const Story = require('../models/Story')
const Discount = require('../models/Discount')

const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/badRequestError')
const UnauthentiatedError = require('../errors/unauthenticatedError')
const NotFoundError = require('../errors/notFoundError')
const {
    createTokenUser,
    attachTokenToRes,
    Permission,
} = require('../utils')

const getAllUsers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
    console.log(req.params.id)
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if (!user) {
      throw new NotFoundError(`No user with id : ${req.params.id}`);
    }
    Permission(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
  };

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).render('account', {user: req.user});
};

const updateUser = async (req, res) => {
    const { email, name,phone } = req.body;
    if (!email || !name) {
      throw new BadRequestError('Please provide all values');
    }
    const user = await User.findById(req.user.userId);
   
    user.email = email;
    user.name = name;
    user.phone = phone;
    await user.save();
  
    const tokenUser = createTokenUser(user);
    attachTokenToRes({ res, user: tokenUser });

    res.status(StatusCodes.OK).render('account', {user: tokenUser});
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword)
    if (!oldPassword || !newPassword) {
      throw new BadRequestError('Please provide both values');
    }
    const user = await User.findOne( {_id:req.user.userId } );
    console.log(user)
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnauthentiatedError('Invalid Credentials');
    }
    user.password = newPassword;
  
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

const createStory = async (req,res) =>{
  req.body.user = req.user.userId
  const story = await Story.create(req.body)
  res.status(StatusCodes.CREATED).json({ story })
}

const createDiscount = async (req,res) =>{
  const discount = await Discount.create( req.body )
  res.json({ discount })
}

const saveDiscount = async (req,res) =>{
  const { id } = req.params
  const user = await User.findOne({ _id:req.user.userId })

  const thisDiscount = await Discount.findOne({ _id:id })
  var discount = user.discount 
  
  if( discount==undefined ){
    discount = []
    discount[0] = thisDiscount.name
    const newUser = await User.findByIdAndUpdate({ _id:req.user.userId }, {discount: discount})
    
  }

  discount = [...discount, thisDiscount.name]
  const newUser = await User.findByIdAndUpdate({ _id:req.user.userId }, {discount: discount})
  
  res.redirect('/KACoffe/v1/discount');
  
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    createStory,
    createDiscount,
    saveDiscount
}