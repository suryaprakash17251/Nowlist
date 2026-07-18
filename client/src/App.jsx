import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';

const Home = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <div style={{ maxWidth: 600, margin: '20px auto', display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
        <h3>Welcome, {user?.name}</h3>
        <button onClick={logout}>Log out</button>
      </div>
      <TodoList />
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? children : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;