const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    tweets: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'tweet'
    }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = User;
