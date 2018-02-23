'use strict';
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var answerSchema = new Schema({
  Answer: { type: String, required: false },
  Intent: { type: String, required: false },  
  created_at: { type: Date, required: false }
});

// the schema is useless so far
// we need to create a model using it
var answer = mongoose.model('answer', answerSchema);

// make this available to our conversations in our Node applications
module.exports = answer;