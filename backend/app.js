const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product.routes.js');
const client=require('./redis');

const app = express();

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Middleware
app.use(express.json());
app.get('/api/products',(req, res)=>{
  res.status(200).json("Got it")
})

// Routes
app.use('/api/products', productRoutes);

module.exports = app;
