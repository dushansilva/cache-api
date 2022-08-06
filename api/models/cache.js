const mongoose = require('mongoose');

const cacheSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

module.exports = mongoose.model('Cache', cacheSchema);
