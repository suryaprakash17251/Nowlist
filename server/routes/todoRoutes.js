const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    try {
        const todo = new Todo({ ...req.body, userId: req.user._id });
        await todo.save();

        const io = req.app.get('io');
        io.to(req.user._id.toString()).emit('todo:created', todo);

        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/by-date/:date', protect, async (req, res) => {
    try {
        const start = new Date(req.params.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(req.params.date);
        end.setHours(23, 59, 59, 999);

        const todos = await Todo.find({
            userId: req.user._id,
            dueDate: { $gte: start, $lte: end }
        });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!todo) return res.status(404).json({ error: 'Todo not found' });

        const io = req.app.get('io');
        io.to(req.user._id.toString()).emit('todo:updated', todo);

        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!todo) return res.status(404).json({ error: 'Todo not found' });

        const io = req.app.get('io');
        io.to(req.user._id.toString()).emit('todo:deleted', { _id: req.params.id });

        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;