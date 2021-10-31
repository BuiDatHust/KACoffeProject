require('dotenv').config()

const express = require('express')
const app = express()

//connect database
const connectDB = require('./db/connect')

app.use(express.json())

app.get('/', (req,res) =>{
    res.send("sxnsjncsj")
})

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