require('dotenv').config()
require('express-async-errors');

const express = require('express')
const app = express()

//option pakages
const cookieParser = require('cookie-parser')

//connect database
const connectDB = require('./db/connect')

//routes
const authRouter= require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const orderRouter = require('./routes/orderRoutes')

//middleware
const notFoundMiddleware = require('./middleware/not-found')

app.use(express.json())
app.use(cookieParser('jwtSecret'))

app.use('/KACoffe/v1/auth', authRouter)
app.use('/KACoffe/v1/user', userRouter)
app.use('/KACoffe/v1/product', productRouter)
app.use('/KACoffe/v1/order', orderRouter)

app.use(notFoundMiddleware)

const port = process.env.PORT || 5000;
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, (req, res) => {
            console.log(`app is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()