const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            enum: ['personal', 'work', 'sign-in', 'other'],
            default: 'other'
        },
        completed: {
            type: Boolean,
            default: false
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        dueDate: {
            type: Date,
            required: true
        },
        reminderEnabled: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);