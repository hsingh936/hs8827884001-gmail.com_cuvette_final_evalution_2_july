const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['backlog', 'to do', 'progress', 'done'],
    default: 'to do'
  },
  checklistItems: {
    type: [{ text: String, checked: Boolean }],
    default: []
  },
  dueDate: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
