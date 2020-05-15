const mongoose = require('mongoose');

const teamsSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
});

module.exports = mongoose.model('Teams', teamsSchema);
