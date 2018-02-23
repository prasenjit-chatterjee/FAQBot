'use strict';

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var conversationSchema = new Schema({
  chat_id: { type: String, required: true },
  message_id: { type: String, required: true },
  request: { type: String, required: true },
  response: { type: String, required: true },
  feedback: Boolean,
  trained: Boolean,
  created_at: { type: Date, required: true }
});

// the schema is useless so far
// we need to create a model using it
var conversation = mongoose.model('conversations', conversationSchema);

// make this available to our conversations in our Node applications
module.exports = conversation;