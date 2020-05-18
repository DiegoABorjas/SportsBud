const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Creating the new Database Schema for the Teams
const usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

usersSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', usersSchema);
