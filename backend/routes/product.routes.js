const express = require('express');
const Product = require('../models/product.model.js');
const client=require('../redis.js');
const router = express.Router();

// Middleware to check cache
const checkCache = (req, res, next) => {
  const { productId } = req.params;

  client.get(`product:${productId}`, (err, data) => {
    if (err) throw err;

    if (data) {
      res.status(200).json(data);
    } else {
      next();
    }
  });
};

// Route to get product details
router.get('/:productId', checkCache, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    // Save response in Redis
    client.setex(`product:${productId}`, 3600, JSON.stringify(product)); // Cache for 1 hour

    res.json(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to add item to cart
router.post('/cart', (req, res) => {
    const { userId, itemId, quantity } = req.body;
  
    const cartKey = `cart:${userId}`;
  
    client.hset(cartKey, itemId, quantity, (err, reply) => {
      if (err) throw err;
  
      res.sendStatus(409);
    });
  });
  
  // Route to get cart items
  router.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;
  
    const cartKey = `cart:${userId}`;
  
    client.hgetall(cartKey, (err, items) => {
      if (err) throw err;
  
      res.json(items);
    });
  });
  

module.exports = router;
