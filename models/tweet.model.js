const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    tweet: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        trim: true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ]
}, { timestamps: true });

const Tweet = mongoose.model('tweet', tweetSchema);

module.exports = Tweet;
