const express = require('express');
const {
  cacheHits, getAllKeys, deleteKeys, createCache,
} = require('../controller/cache-controller');
const { convert } = require('../untility');

const router = express.Router();

router.post('/', async (req, res) => {
  const { key } = req.body;
  try {
    if (!key) {
      throw new Error('Cache key cannot be empty');
    }
    const result = await createCache({ key });
    return res.status(200).json({
      data: convert({ cache: result }),
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
      data: { value: result },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message ? error.message : 'error while getting cache',
    });
  }
});

router.get('/keys', async (req, res) => {
  try {
    const result = await getAllKeys();
    res.status(200).json({
      data: { keys: result },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message ? error.message : 'error while getting all cache keys',
    });
  }
});

router.delete('/', async (req, res) => {
  const { key } = req.query;
  try {
    if (!key) {
      throw new Error('Cache key cannot be empty');
    }
    const result = await deleteKeys({ key });
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message ? error.message : 'error while deleting all cache keys',
    });
  }
});

router.delete('/keys', async (req, res) => {
  try {
    const result = await deleteKeys({});
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message ? error.message : 'error while deleting cache key',
    });
  }
});

module.exports = router;
