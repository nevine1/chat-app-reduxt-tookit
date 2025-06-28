const express = require('express');
const Message = require('../models/MessageModel');

const getLastMessages = async (req, res) => {
    try {
      const myId = req.params.userId;
  
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [{ senderId: myId }, { receiverId: myId }],
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$senderId", myId] },
                "$receiverId",
                "$senderId"
              ],
            },
            lastMessage: { $first: "$$ROOT" },
          },
        },
      ]);
  
      const data = [];
  
      for (const m of messages) {
        const user = await User.findById(m._id).select('-password');
        data.push({ friend: user, lastMessage: m.lastMessage });
      }
  
      res.json({ success: true, data });
  
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  

module.exports = {
    getLastMessages
};





const { ConversationModel } = require("../models/ConversationModel")

const getConversation = async(currentUserId)=>{
    if(currentUserId){
        const currentUserConversation = await ConversationModel.find({
            "$or" : [
                { sender : currentUserId },
                { receiver : currentUserId}
            ]
        }).sort({  updatedAt : -1 }).populate('messages').populate('sender').populate('receiver')

        const conversation = currentUserConversation.map((conv)=>{
            const countUnseenMsg = conv?.messages?.reduce((preve,curr) => {
                const msgByUserId = curr?.msgByUserId?.toString()

                if(msgByUserId !== currentUserId){
                    return  preve + (curr?.seen ? 0 : 1)
                }else{
                    return preve
                }
             
            },0)
            
            return{
                _id : conv?._id,
                sender : conv?.sender,
                receiver : conv?.receiver,
                unseenMsg : countUnseenMsg,
                lastMsg : conv.messages[conv?.messages?.length - 1]
            }
        })

        return conversation
    }else{
        return []
    }
}

module.exports = getConversation