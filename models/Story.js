const mongoose = require('mongoose')

const Story = new mongoose.Schema({
    description: {
        type: String,
        minLength: 100,
        required: [true, "Please provide description"]
    },
    title: {
        type: String,
        maxLength: 20,
        required: [true, "Please provide title"]
    },
    image: {
        type: String,
        required: false
    },
    user: {
        ref: "User",
        type: mongoose.Types.ObjectId,
        required: true
    },
    descriptionDetail: {
        type: String,
        minLength: 100,
        required: [true, "Please provide description detail"]
    },
}, { timestamps: true })

module.exports = mongoose.model("Story", Story)