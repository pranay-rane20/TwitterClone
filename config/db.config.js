const mongoose = require("mongoose");

async function connectDB() {
    await mongoose.connect("mongodb://127.0.0.1:27017/twitterclone");
    console.log("connected to db");
}

connectDB();

module.exports = mongoose.connection;