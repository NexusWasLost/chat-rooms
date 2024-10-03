require('dotenv').config();

const express = require('express');
const app = express();
const { createServer } = require('node:http');
const path = require('node:path');
const { Server } = require('socket.io');
const shortUniqueId = require('short-unique-id');
const db = require('./DB/db.js');
const Room = require('./DB/dbModel.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`server listening on port ${port}`);
})

//serve static files from public directory and mount other middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, './pages/index.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Some Error Occured !");
    }
})

app.get('/info', async (req, res) => {
    try {
        let nickname = req.cookies.nickname;
        let roomId = req.cookies.roomId;

        //clear cookies
        res.clearCookie('nickname');
        res.clearCookie('roomId');

        res.status(200).json({ 'nickname': nickname, 'roomId': roomId });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Some Error Occured !");
    }
})

//get the nickname and room id from the home page !
app.post('/', async (req, res) => {
    try {
        const { nicknameValue, roomIdValue } = req.body;
        if (!nicknameValue) return res.status(400).send("Nickname is required !");

        let nickname = nicknameValue;
        let roomId;

        //user requested to host a room
        if (!roomIdValue) {

            //generate room id until an unique one is not found !
            do {
                const { randomUUID } = new shortUniqueId({ length: 10 });
                roomId = randomUUID();
            } while (await Room.exists({ roomId }));

            const newRoom = new Room({ roomId });
            await newRoom.save();
        }
        else {
            const checkRoom = await Room.findOne({ roomId: roomIdValue });
            if (!checkRoom) return res.status(404).send("Room does not exists !");

            roomId = checkRoom.roomId;
        }

        //set cookies
        res.cookie('nickname', nickname, { httpOnly: true });
        res.cookie('roomId', roomId, { httpOnly: true });
        res.status(200).redirect(`/chat/${roomId}`);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Some Error Occured !");
    }
})

app.get('/chat/:roomid', async (req, res) => {
    try {

        if (!req.cookies.nickname) {
            return res.status(200).redirect('/');
        }

        res.status(200).sendFile(path.join(__dirname, './pages/chat.html'));
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Some Error Occured !");
    }
})

io.on('connection', socket => {

    //retrieve required parameter from the initial handshake
    const { nickname, roomId } = socket.handshake.query;

    socket.join(roomId);

    console.log(`A client has connected with socket id: ${socket.id}, nickname: ${nickname} has joined room: ${roomId}`);
    socket.broadcast.to(roomId).emit('new-user-joined', nickname);

    socket.on('message', (msg, client_avatar, client_nickname, client_roomId) => {
        msg = " " + client_nickname + " : " + msg
        socket.broadcast.to(client_roomId).emit('message', msg, client_avatar);
    });

    socket.on('disconnect', async () => {
        console.log(`A client with client id : ${socket.id} has disconnected`);
        socket.broadcast.to(roomId).emit('left-user', nickname);


        const room = io.sockets.adapter.rooms.get(roomId);
        let roomSize = 0;
        if (room) roomSize = room.size;

        if (roomSize === 0) {
            await Room.findOneAndDelete({ roomId });
            console.log(`Room ${roomId} deleted from database`);
        }
    })
})