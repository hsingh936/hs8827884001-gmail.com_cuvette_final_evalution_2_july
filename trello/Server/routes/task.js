const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/task_model');


router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, priority, checklistItems, dueDate } = req.body;
    const newTask = new Task({
      title,
      priority,
      checklistItems,
      dueDate
    });
    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

router.get('/tasks', authMiddleware, async (req, res) => {
  try {

    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.put('/tasks/:id/checklist', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { checklistItems } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.checklistItems = checklistItems;
    await task.save();

    res.status(200).json({ message: 'Checklist items updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update checklist items', error: error.message });
  }
});

router.put('/tasks/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;

   
    const deletedTask = await Task.findByIdAndDelete(taskId);

    
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
   
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, priority, checklistItems, dueDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, {
      title,
      priority,
      checklistItems,
      dueDate
    }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/tasks/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
});

module.exports = router;
