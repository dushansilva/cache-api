const mongoose = require('mongoose');
const moment = require('moment');
const {
  uniqueNamesGenerator, adjectives, colors, animals,
} = require('unique-names-generator');
const Cache = require('../models/cache');

const isExpired = ({ cache }) => {
  const startDate = moment(cache.lastHit);
  const now = moment(new Date());
  const durationInSeconds = moment.duration(now.diff(startDate)).asSeconds();
  return durationInSeconds > cache.ttl;
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
  );
};

const addCache = async ({ key, value }) => {
  const cache = new Cache({
    _id: new mongoose.Types.ObjectId(),
    key,
    value,
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
    console.log('Cache expired adding new data');
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

const deleteKeys = ({ key }) => {
  if (!key) {
    console.log('Deleting all keys');
    return Cache.deleteMany().exec();
  }
  console.log(`Deleting key: ${key}`);
  return Cache.deleteOne({ key }).exec();
};

module.exports = {
  findCacheByKey,
  addCache,
  updateCache,
  cacheHits,
  getAllKeys,
  deleteKeys,
};
