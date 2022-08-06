const mongoose = require('mongoose');
const {
  uniqueNamesGenerator, adjectives, colors, animals,
} = require('unique-names-generator');
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

const cacheHits = async ({ key }) => {
  const existingCache = await findCacheByKey({ key });
  if (existingCache && existingCache.length >= 1) {
    console.log('Cache hit');
    return existingCache[0].value;
  }
  console.log('Cache miss');
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
  const result = await addCache({ key, value: randomName });
  return result.value;
};

module.exports = {
  findCacheByKey,
  addCache,
  updateCache,
  cacheHits,
};
