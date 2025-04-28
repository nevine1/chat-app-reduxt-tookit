const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const app = express();
require("dotenv").config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

//online user
const onlineUser = new Set();
io.on("connection", async (socket) => {
    console.log("Socket connected:", socket.id);
    const token = socket.handshake.auth.authToken;
    if (!token) {
        console.log('No authToken provided, disconnecting socket');
        socket.disconnect();
        return;
    }
    try {
        const user = await getUserDetailsFromToken(token);
        if (!user) {
            console.log('Invalid token, disconnecting socket');
            socket.disconnect();
            return;
        }

        socket.join(user._id);
        onlineUser.add(user._id);
        io.emit('onlineUser', Array.from(onlineUser));

    } catch (error) {
        console.error('Error during socket authentication:', error);
        socket.disconnect();
    }
});


module.exports = { app, server };
