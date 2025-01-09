const express = require('express');
const router = express.Router();
const Category = require('../models/Category.js');
const { protect } = require('../middleware/auth.js');


router.use(protect);

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    let category = await Category.findOne({ user: req.user.id, name });

    if (category) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    category = new Category({
      user: req.user.id,
      name,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await category.remove();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
