const mongoose = require('mongoose');

// Creating the new Database Schema for the Teams
const teamsSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sport: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
});

// This makes the schema work with 2dsphere index.
teamsSchema.index({geometry: '2dsphere'});
module.exports = mongoose.model('Teams', teamsSchema);
