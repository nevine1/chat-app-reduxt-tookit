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
  
     
      if (conversation && conversation._id) {
          const updateConversation = await Conversation.updateOne(
              { _id: conversation._id }, // Use conversation._id 
              { "$push": { messages: saveMessage._id } }
          );
          console.log("Conversation updated:", updateConversation);
      } else {
          console.error("Conversation object is invalid or missing _id. Cannot update conversation with new message.");
         
          return; 
      }
  
  
      const getConversationMessage = await Conversation.findOne({
          "$or": [
              { sender: data?.sender, receiver: data?.receiver },
              { sender: data?.receiver, receiver: data?.sender }
          ]
      }).populate('messages').sort({ updatedAt: -1 });
  
      console.log('Conversation retrieved with populated messages:', getConversationMessage);
  
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

    //sidebar's last msg

    socket.on("sidebar", async (currentUserId) => {
      console.log("current user id in the sidebar page is: ", currentUserId)
      const currentUserConversation = await Conversation.find({
        "$or": [
          { sender: currentUserId }, 
          { receiver: currentUserId}
        ]
      }).sort({ updatedAt: -1 })

      console.log('current conversation is: ', currentUserConversation)

      const conversation = currentUserConversation.map((conv) => {
        
        const countUnseenMsg = conv?.messages?.reduce((prev,curr) => {
          const msgByUserId = curr?.msgByUserId?.toString()

          if(msgByUserId !== currentUserId){
              return  prev + (curr?.seen ? 0 : 1)
          }else{
              return prev
          }
       
      },0)
        return {
          _id: conv?._id, 
          sender: conv?.sender, 
          receiver: conv?.receiver, 
          unseenMsg: countUnseenMsg, 
          lastMsg: conv.messages[conv?.messages?.length -1]
        }
      })
      socket.emit('conversation', conversation)
    })

     /* socket.on('sidebar', async(currentUserId)=>{
      console.log("current user",currentUserId)

      const conversation = await getConversation(currentUserId)

      socket.emit('conversation',conversation)
      
        }) */

      /*   socket.on('seen',async(msgByUserId)=>{
            
            let conversation = await ConversationModel.findOne({
                "$or" : [
                    { sender : user?._id, receiver : msgByUserId },
                    { sender : msgByUserId, receiver :  user?._id}
                ]
            })

      const conversationMessageId = conversation?.messages || []

      const updateMessages  = await MessageModel.updateMany(
          { _id : { "$in" : conversationMessageId }, msgByUserId : msgByUserId },
          { "$set" : { seen : true }}
      )

      //send conversation
      const conversationSender = await getConversation(user?._id?.toString())
      const conversationReceiver = await getConversation(msgByUserId)

      io.to(user?._id?.toString()).emit('conversation',conversationSender)
      io.to(msgByUserId).emit('conversation',conversationReceiver)
  }) */
    
//disconnect 
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
