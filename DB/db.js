const mongoose = require('mongoose');

db_LOCAL_URL = 'mongodb://localhost:27017/chatRooms';
let dbURL = process.env.db_REMOTE_URL || db_LOCAL_URL;
mongoose.connect(dbURL);

let db = mongoose.connection;

db.on('connected', () =>{
    console.log("Connected to database");
})

db.on('disconnected', () =>{
    console.log("Disconnected from database");
})

db.on('error', (error) =>{
    console.log("MongoDB connection error" + error);
})

module.exports = db;
