const mongoose = require('mongoose');

const cacheSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  createdDate: { type: Date },
  updatedDate: { type: Date },
  lastHit: { type: Date },
  ttl: { type: Number, default: 60 },
});

module.exports = mongoose.model('Cache', cacheSchema);
