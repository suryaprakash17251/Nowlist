import { useState } from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editCategory, setEditCategory] = useState(todo.category);
    const [editPriority, setEditPriority] = useState(todo.priority);
    const [editDueDate, setEditDueDate] = useState(() => {
        try {
            return new Date(todo.dueDate).toISOString().split('T')[0];
        } catch {
            return '';
        }
    });

    const handleSave = async () => {
        if (!editTitle.trim()) return;
        await onEdit(todo._id, {
            title: editTitle,
            category: editCategory,
            priority: editPriority,
            dueDate: editDueDate
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setEditCategory(todo.category);
        setEditPriority(todo.priority);
        try {
            setEditDueDate(new Date(todo.dueDate).toISOString().split('T')[0]);
        } catch {
            setEditDueDate('');
        }
        setIsEditing(false);
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderBottom: '1px solid #333',
                opacity: todo.completed && !isEditing ? 0.5 : 1
            }}
        >
            {isEditing ? (
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 6 }}>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ padding: 6, fontSize: 16 }}
                    />
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            style={{ padding: 4 }}
                        >
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="sign-in">Sign-in</option>
                            <option value="other">Other</option>
                        </select>
                        <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            style={{ padding: 4 }}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            style={{ padding: 4 }}
                        />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggle(todo)}
                    />
                    <div>
                        <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.title}
                        </div>
                        <small style={{ color: '#888' }}>
                            {todo.category} · {todo.priority} · {new Date(todo.dueDate).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            )}
            
            <div style={{ display: 'flex', gap: 6, marginLeft: 10 }}>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} style={{ color: 'green', padding: '4px 8px' }}>
                            Save
                        </button>
                        <button onClick={handleCancel} style={{ padding: '4px 8px' }}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} style={{ padding: '4px 8px' }}>
                            Edit
                        </button>
                        <button onClick={() => onDelete(todo._id)} style={{ color: 'red', padding: '4px 8px' }}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoItem;