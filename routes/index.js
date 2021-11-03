// const authRoute = require(authRoutes)
// const orderRoute = require(orderRoutes)
// const productRoute = require(productRoutes)
// const reviewRoute = require(reviewRoutes)
const userRoute = require('./userRoutes')
    

function route(app) {
    app.use('/users', userRoute);
    app.get('/', (req, res, next) => {
        res.send('Welcome to KACoffe ');
    });
}

module.exports = route;