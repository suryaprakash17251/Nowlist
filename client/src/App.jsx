import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';

const Home = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ maxWidth: 500, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={logout}>Log out</button>
      <p>Todo list UI comes next (Day 6).</p>
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