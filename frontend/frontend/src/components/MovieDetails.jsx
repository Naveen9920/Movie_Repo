import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        alert('Failed to fetch movie details.');
      }
      setLoading(false);
    };

    fetchMovie();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!movie) return <p className="p-4">Movie not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{movie.title} ({movie.year})</h1>
      <p className="text-gray-700 mb-4">{movie.plot}</p>

      <div className="mb-2"><strong>Genre:</strong> {movie.genre.join(', ')}</div>
      <div className="mb-2"><strong>Director:</strong> {movie.director}</div>
      <div className="mb-2"><strong>Actors:</strong> {movie.actors.join(', ')}</div>
      <div className="mb-2"><strong>Runtime:</strong> {movie.runtime} minutes</div>
      <div className="mb-2"><strong>Rating:</strong> {movie.rating}</div>
      <div className="mt-4">
        <a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" className="text-blue-600 underline">
          View on IMDb
        </a>
      </div>

      <Link to="/" className="mt-6 inline-block text-sm text-blue-500">← Back to Search</Link>
    </div>
  );
};

export default MovieDetails;
