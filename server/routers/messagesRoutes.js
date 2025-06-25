const express = require('express');
const router = express.Router();
const Message = require('../models/MessageModel');
const Conversation = require('../models/ConversationModel');
const lastMessageRoute = require('../controllers/messagesController')
router.get('/:userId', async (req, res) => {

  const senderId = req.query.myId;
  const userId = req.params.userId;

  try {
    const conversation = await Conversation.findOne({
      $or: [
        { sender: senderId, receiver: userId },
        { sender: userId, receiver: senderId }
      ]
    }).populate('messages');

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

router.get('/last-message/:userId', lastMessageRoute)
module.exports = router;
