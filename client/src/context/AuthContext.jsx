import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('nowlist_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const register = async (name, email, password) => {
        const { data } = await axios.post(`${API_URL}/register`, { name, email, password });
        localStorage.setItem('nowlist_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/login`, { email, password });
        localStorage.setItem('nowlist_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('nowlist_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);