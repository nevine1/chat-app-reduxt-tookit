const http = require("http");
const { Server } = require("socket.io");
const User = require("../models/UserModel");
const Conversation = require("../models/ConversationModel");
const Message = require("../models/MessageModel");
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
    const token = socket.handshake.auth.authToken;//auth.token , this is the token coming from the front end
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
    
    //send new message 
    socket.on('new message', async (data) => {
      // Check conversation availability for both users
      console.log("Received new message:", data);
  
      let conversation = await Conversation.findOne({
          "$or": [
              { sender: data?.sender, receiver: data?.receiver },
              { sender: data?.receiver, receiver: data?.sender }
          ]
      });
  
      if (!conversation) {
          // FIX 1: Ensure 'new' keyword is used for Mongoose model instantiation
          // and AWAIT the save operation to get the saved document.
          const createConversation = new Conversation({ // Use 'new'
              sender: data?.sender,
              receiver: data?.receiver
          });
          conversation = await createConversation.save(); // AWAIT this save!
          console.log("New conversation created:", conversation);
      } else {
          console.log("Existing conversation found:", conversation);
      }
  
      const message = new Message({
          text: data.text,
          imageUrls: data.imageUrls, // This expects imageUrls to be an array of URLs from the frontend
          videoUrls: data.videoUrls,
          msgByUserId: data.msgByUserId
      });
  
      const saveMessage = await message.save();
      console.log("Message saved:", saveMessage);
  
      // FIX 2: Ensure conversation object is valid before attempting to update.
      // This is important because if createConversation.save() above failed or wasn't awaited,
      // conversation could be undefined or a promise.
      if (conversation && conversation._id) {
          const updateConversation = await Conversation.updateOne(
              { _id: conversation._id }, // Use conversation._id directly
              { "$push": { messages: saveMessage._id } }
          );
          console.log("Conversation updated:", updateConversation);
      } else {
          console.error("Conversation object is invalid or missing _id. Cannot update conversation with new message.");
          // You might want to handle this error more robustly, e.g., by informing the sender.
          return; // Stop processing if conversation is invalid
      }
  
  
      const getConversationMessage = await Conversation.findOne({
          "$or": [
              { sender: data?.sender, receiver: data?.receiver },
              { sender: data?.receiver, receiver: data?.sender }
          ]
      }).populate('messages').sort({ updatedAt: -1 });
  
      console.log('Conversation retrieved with populated messages:', getConversationMessage);
  
      // FIX 3: Emitting to specific users.
      // The `io.to(socketId).emit()` method works by sending to a specific socket ID.
      // If `data.sender` and `data.receiver` are user IDs (e.g., MongoDB `_id`s from your database),
      // you need a way to map these user IDs to their respective `socket.id`s.
      // The most common and robust way is to have users `socket.join(userId)` a room named after their ID
      // when they connect. Then you can emit to that room: `io.to(userId).emit(...)`.
      // If you're not using rooms, you'll need a server-side map (e.g., `const userSocketMap = new Map();`)
      // where you store `userSocketMap.set(userId, socket.id)` on connection.
  
      // Assuming you have a mechanism (like rooms named after user IDs) where data.sender and data.receiver
      // represent the IDs of the users/rooms to send to:
      if (data?.sender) {
          io.to(data.sender).emit('message', getConversationMessage.messages);
          console.log(`Emitting to sender (${data.sender}):`, getConversationMessage.messages.length, "messages");
      }
      if (data?.receiver) {
          io.to(data.receiver).emit('message', getConversationMessage.messages);
          console.log(`Emitting to receiver (${data.receiver}):`, getConversationMessage.messages.length, "messages");
      } else {
          console.warn("Receiver ID is missing, message not emitted to receiver.");
      }
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
