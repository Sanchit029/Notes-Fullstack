const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Middlewares — first!
app.use(cors());
app.use(express.json());

// Routes — after middlewares
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5001, () => console.log('Server running on port 5001'));
  })
  .catch((err) => console.log(err));