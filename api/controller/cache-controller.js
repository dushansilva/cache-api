const mongoose = require('mongoose');

const Cache = require('../models/cache');

const findCacheByKey = async ({ key }) => Cache.find({ key }).exec();
const updateCache = async ({ key, value }) => Cache.findOneAndUpdate(
  { key },
  { value },
  {
    new: true,
  },
);
const addCache = async ({ key, value }) => {
  const cache = new Cache({
    _id: new mongoose.Types.ObjectId(),
    key,
    value,
  });
  return cache.save();
};

module.exports = {
  findCacheByKey,
  addCache,
  updateCache,
};
