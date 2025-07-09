const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  imdbID: { type: String, unique: true },
  title: String,
  year: String,
  genre: [String],
  director: String,
  actors: [String],
  runtime: Number,
  rating: Number,
  lastFetched: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
