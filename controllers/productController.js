const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const NotFoundError = require('../errors/notFoundError')
const BadRequestError = require('../errors/badRequestError')
const path = require('path')


const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    req.body.Image = [];

    console.log(req.files)
    req.files.forEach(function(img){
      const length = img.destination.length
      req.body.Image = [ ...req.body.Image, img.destination.slice(8,length) +'/'+ img.filename]
    })
    
    
    
    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).render('addProduct');
};

const getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).render('menu', {products: products});
};



const updateProduct = async (req, res) => {
    const { id: productId } = req.params;
  
    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
      new: true,
      runValidators: true,
    });
  
    if (!product) {
      throw new NotFoundError(`No product with id : ${productId}`);
    }
  
    res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;
  
    const product = await Product.findOne({ _id: productId });
  
    if (!product) {
      throw new NotFoundError(`No product with id : ${productId}`);
    }
  
    await product.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
};

const uploadImage = async (req, res) => {
    if (!req.files) {
      throw new BadRequestError('No File Uploaded');
    }
    const productImage = req.files.image;
  
    if (!productImage.mimetype.startsWith('image')) {
      throw new BadRequestError('Please Upload Image');
    }
  
    const maxSize = 1024 * 1024;
  
    if (productImage.size > maxSize) {
      throw new BadRequestError(
        'Please upload image smaller than 1MB'
      );
    }
  
    const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
    );
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};


module.exports = {
    createProduct,
    getAllProducts,
    // getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}