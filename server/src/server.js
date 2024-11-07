require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const app = express();
require('../Database/mongoose');

app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
const PORT = process.env.PORT || 6969;

const io = socketio(server, {
    cors: {
        origin: `http://localhost:3000`,
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('clinet has joined');

    socket.on('disconnect', () => {
        console.log('client has left');
    })
})




server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})