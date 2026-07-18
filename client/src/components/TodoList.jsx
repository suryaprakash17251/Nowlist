import { useState, useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import useSocket from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';
import TodoItem from './TodoItem';

const TodoList = () => {
    const { user } = useAuth();
    const api = useAxios();
    const socketRef = useSocket(user?.token);

    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('other');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);

    // Initial fetch
    useEffect(() => {
        const fetchTodos = async () => {
            const { data } = await api.get('/todos');
            setTodos(data);
        };
        fetchTodos();
    }, []);

    // Live socket updates
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.on('todo:created', (todo) => {
            setTodos((prev) => [...prev, todo]);
        });

        socket.on('todo:updated', (updated) => {
            setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        });

        socket.on('todo:deleted', ({ _id }) => {
            setTodos((prev) => prev.filter((t) => t._id !== _id));
        });

        return () => {
            socket.off('todo:created');
            socket.off('todo:updated');
            socket.off('todo:deleted');
        };
    }, [socketRef.current]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        await api.post('/todos', { title, category, priority, dueDate });
        setTitle('');
    };

    const handleToggle = async (todo) => {
        await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
    };

    const handleDelete = async (id) => {
        await api.delete(`/todos/${id}`);
    };

    // Group by date for the progress view
    const grouped = todos.reduce((acc, todo) => {
        const dateKey = new Date(todo.dueDate).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(todo);
        return acc;
    }, {});

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>My Tasks</h2>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="New task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ flex: 1, padding: 8, minWidth: 150 }}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="sign-in">Sign-in</option>
                    <option value="other">Other</option>
                </select>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>

            {Object.keys(grouped).length === 0 && <p>No tasks yet.</p>}

            {Object.entries(grouped).map(([date, dayTodos]) => {
                const completedCount = dayTodos.filter((t) => t.completed).length;
                const percent = Math.round((completedCount / dayTodos.length) * 100);

                return (
                    <div key={date} style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <strong>{date}</strong>
                            <span>{completedCount}/{dayTodos.length}</span>
                        </div>
                        <div style={{ background: '#333', height: 6, borderRadius: 3, marginBottom: 8 }}>
                            <div
                                style={{
                                    width: `${percent}%`,
                                    background: '#4caf50',
                                    height: '100%',
                                    borderRadius: 3,
                                    transition: 'width 0.3s ease'
                                }}
                            />
                        </div>
                        {dayTodos.map((todo) => (
                            <TodoItem key={todo._id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default TodoList;