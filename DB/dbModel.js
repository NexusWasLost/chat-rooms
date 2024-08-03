const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    }
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;