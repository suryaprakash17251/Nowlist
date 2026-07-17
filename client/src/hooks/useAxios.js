import axios from 'axios';

const useAxios = () => {
    const storedUser = localStorage.getItem('nowlist_user');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    const instance = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    return instance;
};

export default useAxios;