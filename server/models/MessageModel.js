const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: string,
        default: ""
    }, 
    imageUrl: {
        type: String, 
        default: ""
    }, 
    videoUrl: {
        type: String, 
        default: ""
    }, 
    seen: {
        type: boolean,
        default: false
    }
}, {
    timestamps: true
})

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;