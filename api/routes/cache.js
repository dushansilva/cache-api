const express = require('express');
const {
  uniqueNamesGenerator, adjectives, colors, animals,
} = require('unique-names-generator');
const {
  addCache, findCacheByKey, updateCache, cacheHits,
} = require('../controller/cache-controller');

const router = express.Router();

router.post('/', async (req, res) => {
  const { key } = req.body;
  try {
    if (!key) {
      throw new Error('Cache key cannot be empty');
    }
    const existingCache = await findCacheByKey({ key });
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    if (existingCache && existingCache.length >= 1) {
      const result = await updateCache({ key, value: randomName });
      return res.status(200).json({
        message: 'Cache updated successfully',
        data: result,
      });
    }
    const result = await addCache({ key, value: randomName });
    return res.status(200).json({
      message: 'Cache added successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message ? error.message : 'error while adding cache',
    });
  }
});

router.get('/', async (req, res) => {
  const { key } = req.query;
  try {
    if (!key) {
      throw new Error('Cache key cannot be empty');
    }
    const result = await cacheHits({ key });
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message ? error.message : 'error while getting cache',
    });
  }
});

module.exports = router;
