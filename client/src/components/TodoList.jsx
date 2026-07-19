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
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('other');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    useEffect(() => {
        const fetchTodos = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/todos');
                setTodos(data);
            } catch (err) {
                console.error('Failed to load todos:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTodos();
    }, []);

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

    const handleEdit = async (id, updatedFields) => {
        await api.put(`/todos/${id}`, updatedFields);
    };

    const filteredTodos = todos.filter((todo) => {
        const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
        const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
        return matchesSearch && matchesCategory && matchesPriority;
    });

    const grouped = filteredTodos.reduce((acc, todo) => {
        const dateKey = new Date(todo.dueDate).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(todo);
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

    return (
        <div style={{ maxWidth: 600, width: '90%', margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>My Tasks</h2>

            <form
                onSubmit={handleAdd}
                style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}
            >
                <input
                    type="text"
                    placeholder="New task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ flex: '1 1 150px', padding: 8, minWidth: 0 }}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 8 }}>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="sign-in">Sign-in</option>
                    <option value="other">Other</option>
                </select>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: 8 }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ padding: 8 }}
                />
                <button type="submit" style={{ padding: '8px 16px' }}>Add</button>
            </form>

            {/* Search and Filters Section */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: '1 1 150px', padding: 8, minWidth: 0 }}
                />
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ padding: 8 }}
                >
                    <option value="all">All Categories</option>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="sign-in">Sign-in</option>
                    <option value="other">Other</option>
                </select>
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    style={{ padding: 8 }}
                >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            {loading && <p>Loading your tasks...</p>}

            {!loading && sortedDates.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                    <p style={{ fontSize: 18 }}>No tasks yet.</p>
                    <p>Add your first task above to get started.</p>
                </div>
            )}

            {!loading &&
                sortedDates.map((date) => {
                    const dayTodos = grouped[date];
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
                                <TodoItem
                                    key={todo._id}
                                    todo={todo}
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    );
                })}
        </div>
    );
};

export default TodoList;