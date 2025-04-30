

const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

const socketServer = (app) => { // Expecting the Express app as an argument
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

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
            // Assuming you have a function to get user details from the token
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

    return server; // Return the HTTP server instance
};

module.exports = socketServer;