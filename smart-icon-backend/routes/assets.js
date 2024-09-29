// routes/assets.js

const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const axios = require('axios'); // Import axios

// POST /api/assets/generate
router.post('/generate', async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    // Call DeepAI's Text-to-Image API
    const response = await axios.post(
      'https://api.deepai.org/api/text2img',
      { text: description },
      { headers: { 'Api-Key': process.env.DEEPAI_API_KEY } }
    );

    const imageUrl = response.data.output_url;

    // Create and save asset
    const newAsset = new Asset({
      description,
      imageUrl,
    });

    await newAsset.save();

    res.status(201).json(newAsset);
  } catch (error) {
    console.error('Error generating asset:', error.response ? error.response.data : error.message);

    if (error.response) {
      // DeepAI API returned an error response
      return res.status(error.response.status).json({
        error: error.response.data.error || 'Error from DeepAI API',
      });
    } else if (error.request) {
      // No response received from DeepAI API
      return res.status(500).json({ error: 'No response from DeepAI API' });
    } else {
      // Other errors
      return res.status(500).json({ error: 'Error generating asset' });
    }
  }
});

// GET /api/assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Error fetching assets' });
  }
});

// DELETE /api/assets/:id
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    await asset.remove();
    res.json({ message: 'Asset removed' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Error deleting asset' });
  }
});

module.exports = router;