import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: 320, margin: '80px auto', fontFamily: 'sans-serif' }}>
            <h2>Create your Nowlist account</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
                />
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
                <button type="submit" style={{ width: '100%', padding: 8 }}>Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
    );
};

export default Register;