import { Routes, Route } from 'react-router-dom';
import MovieDetails from './components/MovieDetails';
import StatsDashboard from './components/StatsDashboard';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';
import PrivateRoute from './components/PrivateRoute'; // ✅ import wrapper

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/movie/:id" element={<MovieDetails />} />

      {/* ✅ Protected route using wrapper */}
      <Route
        path="/stats"
        element={
          <PrivateRoute>
            <StatsDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
