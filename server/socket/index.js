
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
    

    const onlineUsers = new Set();

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
            //  getting user details from the token
            const user = await getUserDetailsFromToken(token);
            console.log("user connected is:", user)
            console.log("backend online users are:", token)

            if (!user || !user._id ) {
                console.log('Invalid token, disconnecting socket');
                return socket.disconnect();
            }

            //saving user socket session 
            socket.userId = user._id; 
            //join a room 
            socket.join(user?._id);      
            onlineUsers.add(user?._id.toString());
            io.emit('onlineUser', Array.from(onlineUsers));
            
            } catch (error) {
                console.error('Error during socket authentication:', error);
                socket.disconnect();
        }
        
        // When a user disconnects
        socket.on('disconnect', () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                console.log(`User disconnected: ${socket.userId}`);
                // Emit the updated online user list to all connected clients
                io.emit('onlineUsers', Array.from(onlineUsers));
                } 
             });
    })
    
    return server;
}


module.exports = { socketServer};