const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        required: true, 
        ref: 'User' //it refers to UserModel 
    }, 
    receiver: {
        type: mongoose.Schema.ObjectId, 
        required: true,
        ref: 'User'
    }, 
    messages: [
        {
            type: mongoose.Schema.objectId,
            ref: Message,
        }
    ]
}, {
    timestamps: true
})

const ConversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = ConversationModel;