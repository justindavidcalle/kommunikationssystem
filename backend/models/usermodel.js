const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    registerDate:{
        type: Date,
        required: true,
        default: Date.now
    }
})

