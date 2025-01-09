const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');
const { protect } = require('../middleware/auth.js');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', getTask, (req, res) => {
  res.json(res.task);
});

router.post('/', async (req, res) => {
  const { title, description, category, dueDate } = req.body;

  const task = new Task({
    user: req.user.id,
    title,
    description,
    category,
    dueDate,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', getTask, async (req, res) => {
  const { title, description, completed, category, dueDate } = req.body;

  if (title != null) {
    res.task.title = title;
  }
  if (description != null) {
    res.task.description = description;
  }
  if (completed != null) {
    res.task.completed = completed;
  }
  if (category != null) {
    res.task.category = category;
  }
  if (dueDate != null) {
    res.task.dueDate = dueDate;
  }

  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', getTask, async (req, res) => {
  try {
    await res.task.remove();
    res.json({ message: 'Deleted Task' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: 'Cannot find task' });
    }
    
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.task = task;
  next();
}

module.exports = router;
