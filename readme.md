# Chat Rooms

A Simple Chat Application built using WebSockets and Node.js

## Deployement

https://chat-rooms-e9ev.onrender.com/

**NOTE:** The project is hosted on [Render](https://render.com/), on its free plan. So the app will automatically go to sleep when inactive, therefore the next time someone visits it will take some time to load up.

## Tech Stack

**Client:** HTML, CSS and JavaScript

**Server:** Node.js, Express.js, Socket.io and MongoDB

## Features

- Real Time Communication between client and server using Socket.io
- Uses MongoDB and Mongoose to store active rooms only.
- Automatic Room expiry if no participants are present. 
- Ensures complete privacy and safety by not storing any messages on the server.
- Features an easy-to-navigate UI for a smooth chatting experience.

## Installation

If you want to run it locally:

Make Sure You have Node, NPM and MongoDB already installed !

**Download Node:** https://nodejs.org/en

**Download MongoDB(Community Server):** https://www.mongodb.com/try/download/community
 

1. **Clone the Repository:**
```bash
  git clone https://github.com/nexus949/chat-rooms.git
```

2. **Navigate to the directory:**
```bash
  cd chat-rooms
```

3. **Install all the dependencies:**
```bash
  npm install
```

4. **Start the server:**
```bash
  npm start
``` 

The server runs on PORT 3000 !

## Web Sockets and Socket.io
Web Sockets are responsible for establishing a full duplex connection between server and client which allows bidirectional communication flow and sending data over TCP protocol.

This application uses [Socket.io](https://socket.io/) Library to establish a web socket connection and provides easy-to-use API for the purpose.

## AI and tools used

- Socket.io -> https://socket.io/
- ChatGPT -> https://chatgpt.com/