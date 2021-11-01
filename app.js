require('dotenv').config()

const express = require('express')
const app = express()
const Route = require('./routes/index.js')

//connect database
const connectDB = require('./db/connect')

app.use(express.json())

Route(app)

const port = process.env.PORT || 5000;
const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, (req,res) =>{
            console.log(`app is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()