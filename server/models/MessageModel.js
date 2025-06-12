const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    }, 
    imageUrls: {
        type: [String], 
        default: ""
    }, 
    videoUrls: {
        type: [String], 
        default: ""
    }, 
    seen: {
        type: Boolean, 
        default: false
    }, 
    msgByUserId: {
        type: mongoose.Schema.ObjectId,
        required: true, 
        ref: "User",
     }
}, {
    timestamps: true
})

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;