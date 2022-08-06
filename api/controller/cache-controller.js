const mongoose = require('mongoose');
const moment = require('moment');
const {
  uniqueNamesGenerator, adjectives, colors, animals,
} = require('unique-names-generator');
const Cache = require('../models/cache');
const config = require('../../config');

const isExpired = ({ cache }) => {
  const startDate = moment(cache.lastHit);
  const now = moment(new Date());
  const durationInSeconds = moment.duration(now.diff(startDate)).asSeconds();
  return durationInSeconds > cache.ttl;
};

const deleteKeys = ({ key }) => {
  if (!key) {
    console.log('Deleting all keys');
    return Cache.deleteMany().exec();
  }
  console.log(`Deleting key: ${key}`);
  return Cache.deleteOne({ key }).exec();
};

/**
 * This function will get the total count of cache entries in the database and if the count is
 * greater than maximum count defined in the config it will remove the oldest cache entry
 */
const removeOlderEntries = async () => {
  const count = await Cache.find().count();
  if (count === config.MAX_CACHE_ENTRIES) {
    console.log('Max cache entries reached');
    const oldestCache = await Cache.find().sort({ createdDate: 1 }).limit(1);
    const result = await deleteKeys({ key: oldestCache[0].key });
    console.log(`Successully deleted oldest cache entry ${JSON.stringify(result)}`);
  }
};

const findCacheByKey = async ({ key }) => Cache.findOne({ key }).exec();

const updateCache = async ({ key, changes }) => {
  if (!key) {
    throw new Error('Key needs to be passed for updating cache');
  }
  const updates = {};
  if (changes.value) {
    updates.value = changes.value;
  }
  if (changes.lastHit) {
    updates.lastHit = changes.lastHit;
  }

  return Cache.findOneAndUpdate(
    { key },
    { ...updates, updatedDate: new Date() },
    {
      new: true,
    },
  ).exec();
};

const addCache = async ({ key, value }) => {
  const now = new Date();
  removeOlderEntries();
  const cache = new Cache({
    _id: new mongoose.Types.ObjectId(),
    key,
    value,
    createdDate: now,
    updatedDate: now,
    lastHit: now,
  });
  return cache.save();
};

const cacheHits = async ({ key }) => {
  const cache = await findCacheByKey({ key });
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
  if (!cache) {
    console.log('Cache miss');
    const result = await addCache({ key, value: randomName });
    return result.value;
  }
  console.log('Cache hit');
  if (isExpired({ cache })) {
    console.log(`Cache expired for key ${key} adding new data`);
    const result = await updateCache({ key, changes: { value: randomName, lastHit: new Date() } });
    return result.value;
  }
  await updateCache({ key, changes: { lastHit: new Date() } });
  return cache.value;
};

const getAllKeys = async () => {
  const result = await Cache.find().exec();
  if (!result) {
    return [];
  }
  return result.map(({ key }) => key);
};

const createCache = async ({ key }) => {
  const existingCache = await findCacheByKey({ key });
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
  if (existingCache) {
    console.log(`Updating cache for key: ${key}`);
    return updateCache({ key, changes: { value: randomName, lastHit: new Date() } });
  }
  console.log(`adding new cache with key: ${key}`);
  return addCache({ key, value: randomName });
};

module.exports = {
  findCacheByKey,
  addCache,
  updateCache,
  cacheHits,
  getAllKeys,
  deleteKeys,
  createCache,
};
