const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    tweet: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;