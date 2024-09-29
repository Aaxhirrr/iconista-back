const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const assetRoutes = require('./routes/assets');

dotenv.config(); // Ensure this is at the very top

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('Smart Icon & Sticker Generator Backend is running!');
});

// Routes
app.use('/api/assets', assetRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
