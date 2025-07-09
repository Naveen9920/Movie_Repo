import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      className="border rounded p-4 shadow hover:shadow-lg cursor-pointer"
      onClick={() => navigate(`/movie/${movie.imdbID}`)}
    >
      <h2 className="text-xl font-semibold">{movie.title}</h2>
      <p>Year: {movie.year}</p>
      <p>Genre: {movie.genre?.join(', ')}</p>
      <p>Rating: {movie.rating}</p>
    </div>
  );
};

export default MovieCard;
