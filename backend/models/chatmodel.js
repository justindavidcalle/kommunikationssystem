const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  fromUsername: {
    type: String,
    required: true,
  },
  toUsername: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('chats', chatSchema);

