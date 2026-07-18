import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (token) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join', token);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [token]);

    return socketRef;
};

export default useSocket;