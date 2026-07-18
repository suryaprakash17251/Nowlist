const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderBottom: '1px solid #333',
                opacity: todo.completed ? 0.5 : 1
            }}
        >
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
            <button onClick={() => onDelete(todo._id)} style={{ color: 'red' }}>
                Delete
            </button>
        </div>
    );
};

export default TodoItem;