const jwt = require('jsonwebtoken');

const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join', (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.join(decoded.id);
                console.log(`Socket ${socket.id} joined room ${decoded.id}`);
            } catch (err) {
                console.error('Socket auth failed:', err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = initSocket;