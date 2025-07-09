import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [order, setOrder] = useState('desc');
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleSearch = async (query) => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies`, {
        params: {
          search: query,
          sort: sortBy,
          order: order,
          genre: selectedGenre
        }
      });
      setMovies(res.data);
    } catch (err) {
      alert("Failed to fetch movies.");
    }

    setLoading(false);
  };

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}>
        <div style={contentStyle}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "12px", color: "#fff" }}>
            🎬 MovieFlix Search
          </h1>

          <Link to="/stats" style={{ color: "#61dafb", textDecoration: "underline", fontSize: "14px" }}>
            View Stats Dashboard →
          </Link>

          <div style={{ marginTop: "20px" }}>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Filter & Sort */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px" }}>
            <div>
              <label style={labelStyle}>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Order:</label>
              <select value={order} onChange={(e) => setOrder(e.target.value)} style={selectStyle}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Filter by Genre:</label>
              <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} style={selectStyle}>
                <option value="">All</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Thriller">Thriller</option>
              </select>
            </div>
          </div>

          {/* Movie Data */}
          <div style={{ marginTop: "20px", color: "#fff" }}>
            {loading && <p>Loading...</p>}
            {!loading && movies.length === 0 && <p>No movies found</p>}
          </div>

          <div style={gridStyle}>
            {movies.map((movie) => (
              <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID} style={{ textDecoration: "none" }}>
                <MovieCard movie={movie} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Background
const pageStyle = {
  backgroundImage: 'url("https://wallpaperaccess.com/full/329583.jpg")', // Change image if needed
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh'
};

// Dark overlay
const overlayStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  minHeight: '100vh',
  padding: '40px'
};

// Main content
const contentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  color: '#fff'
};

// Reused styles
const labelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  marginBottom: "6px",
  display: "block",
  color: "#fff"
};

const selectStyle = {
  padding: "6px 10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "150px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "30px"
};

export default Home;
