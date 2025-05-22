const http = require("http");
const { Server } = require("socket.io");
const User = require("../models/UserModel");
const { getUserDetailsFromToken } = require("../helpers/getUserDetails");

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

  // Middleware for auth before connection
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.authToken;
    if (!token) {
      return next(new Error("No token provided"));
    }

    try {
      const user = await getUserDetailsFromToken(token);
      if (!user || !user._id) {
        return next(new Error("Invalid token"));
      }

      // attach user to socket object
      socket.user = user;
      next();
    } catch (err) {
      console.error("Error in socket auth middleware:", err);
      return next(new Error("Auth error"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    const userId = user._id.toString();

    console.log("Socket connected:", socket.id, "for user", userId);

    socket.userId = userId;
    socket.join(userId);
    onlineUsers.add(userId);

    io.emit("onlineUser", Array.from(onlineUsers));

    socket.on("message-page", async (targetUserId) => {
      const userDetails = await User.findById(targetUserId).select("-password");
      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
          email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUsers.has(targetUserId),
      };
      socket.emit("message-user", payload);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("onlineUsers", Array.from(onlineUsers));
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  });

  return server;
};

module.exports = { socketServer };
