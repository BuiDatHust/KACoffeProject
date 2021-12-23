const mongoose = require('mongoose');

const Story = new mongoose.Schema(
    {
        description: {
            type: String,
            minLength: 100,
            required: [true, 'Please provide description'],
        },
        detaildescription: {
            type: String,
            minLength: 100,
            required: [true, 'Please provide detaildescription'],
        },
        title: {
            type: String,
            maxLength: 20,
            required: [true, 'Please provide title'],
        },
        image: {
            type: String,
            required: true,
        },
        user: {
            ref: 'User',
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Story', Story);
