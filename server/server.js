const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the .env file');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error.message);
  });