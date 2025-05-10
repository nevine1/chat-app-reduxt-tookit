
const http = require("http");
const { Server } = require("socket.io");
const { getUserDetailsFromToken } = require("../helpers/getUserDetails")
const socketServer = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    

    const onlineUser = new Set();

    io.on("connection", async (socket) => {
       console.log("Socket connected:", socket.id);
        const token = socket.handshake.auth.authToken;
        console.log('auth token in backend is: ', token)
        if (!token) {
            console.log('No authToken provided, disconnecting socket');
            socket.disconnect();
            return;
        }
        try {
            // Assuming you have a function to get user details from the token
            const user = await getUserDetailsFromToken(token);
            console.log("backend online users are:", token)
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
        // When a user disconnects
        socket.on('disconnect', () => {
            if (user?._id) {
                onlineUser.delete(user._id);
                console.log(`User disconnected: ${socket.id} (${user._id})`);
                // Emit the updated online user list to all connected clients
                io.emit('onlineUser', Array.from(onlineUser));
            } else {
                console.log(`Anonymous user disconnected: ${socket.id}`);
            }
        });
    })
    return server;
}


module.exports = { socketServer};