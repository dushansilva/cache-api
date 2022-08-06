const express = require('express');
const mongoose = require('mongoose');
const Cache = require('../models/cache');

const router = express.Router();

router.post('/', async (req, res) => {
  const { key } = req.body;
  try {
    if (!key) {
      throw new Error('Cache key cannot be empty');
    }
    const cache = new Cache({
      _id: new mongoose.Types.ObjectId(),
      key,
      value: 'test',
    });
    const result = await cache.save();
    console.log(result);
    res.status(200).json({
      message: 'Cache added successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message ? error.message : 'error while adding cache',
    });
  }
});

module.exports = router;
