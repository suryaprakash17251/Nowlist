# Nowlist

Real-time to-do list app built with the MERN stack — tasks sync live across devices using Socket.io.

## Features

- JWT authentication (register/login)
- Create, update, and delete tasks with category, priority, and due date
- Tasks scoped per user
- Real-time sync across tabs/devices via Socket.io
- Daily progress bar showing completed vs total tasks per date
- Loading and empty states for a polished experience

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, Socket.io-client
**Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, bcrypt

## Project Structure

```
/client   → React frontend
  /src
    /components   → TodoList, TodoItem, Login, Register
    /context       → AuthContext
    /hooks         → useAxios, useSocket
/server   → Express backend + Socket.io
  /models          → User, Todo
  /routes          → authRoutes, todoRoutes
  /middleware      → authMiddleware
  /socket          → socketHandler
```

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/suryaprakash17251/Nowlist.git
cd Nowlist
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_random_secret
```

Run the server:
```bash
npm run dev
```

You should see:
```
MongoDB Connected Successfully
Server is running on port 5000
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/todos` | Get all todos for the logged-in user |
| GET | `/api/todos/by-date/:date` | Get todos for a specific date |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

## How Real-Time Sync Works

When a todo is created, updated, or deleted, the server emits a Socket.io event (`todo:created`, `todo:updated`, `todo:deleted`) to a private room named after the user's ID. Every open tab or device for that user is listening on that room, so changes appear instantly without a page refresh.

## License

MIT
