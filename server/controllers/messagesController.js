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

