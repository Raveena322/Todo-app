const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

// Create a new todo
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const todo = await Todo.create({ title: title.trim() });
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create todo' });
    }
});

// Get all todos
router.get('/', async (_req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch todos' });
    }
});

// Update a todo (title or completed)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const updates = {};
        if (typeof title === 'string') updates.title = title.trim();
        if (typeof completed === 'boolean') updates.completed = completed;

        const updated = await Todo.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) return res.status(404).json({ message: 'Todo not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update todo' });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Todo.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete todo' });
    }
});

module.exports = router;



