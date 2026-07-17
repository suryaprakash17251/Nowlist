import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: 320, margin: '80px auto', fontFamily: 'sans-serif' }}>
            <h2>Log in to Nowlist</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ width: '100%', padding: 8 }}>Log In</button>
            </form>
            <p>No account? <Link to="/register">Register</Link></p>
        </div>
    );
};

export default Login;