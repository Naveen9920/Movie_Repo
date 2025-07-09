const axios = require('axios');
const Movie = require('../models/Movie'); // ✅ Make sure path matches your model file

const cleanGenres = (genreStr) => genreStr?.split(',').map(g => g.trim()) || [];
const cleanActors = (actorsStr) => actorsStr?.split(',').map(a => a.trim()) || [];

const fetchAndCacheMovie = async (idOrTitle, byId = false) => {
  const url = byId
    ? `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${idOrTitle}`
    : `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${idOrTitle}`;

  const { data } = await axios.get(url);
  if (data.Response === 'False') throw new Error(data.Error);

  const movieData = {
    imdbID: data.imdbID,
    title: data.Title,
    year: data.Year,
    genre: cleanGenres(data.Genre),
    director: data.Director,
    actors: cleanActors(data.Actors),
    runtime: parseInt(data.Runtime) || 0,
    rating: parseFloat(data.imdbRating) || 0,
    lastFetched: new Date()
  };

  await Movie.findOneAndUpdate(
    { imdbID: data.imdbID },
    movieData,
    { upsert: true, new: true }
  );

  return movieData;
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const cached = await Movie.findOne({ imdbID: id });

    if (cached && (Date.now() - new Date(cached.lastFetched).getTime() < 86400000)) {
      return res.json(cached);
    }

    const fresh = await fetchAndCacheMovie(id, true);
    res.json(fresh);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMoviesBySearch = async (req, res) => {
  try {
    const { search, genre, sort = 'rating', order = 'desc' } = req.query;
    if (!search) return res.status(400).json({ error: 'Search query is required' });

    const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${search}`;
    const { data } = await axios.get(url);

    if (data.Response === 'False') return res.status(404).json({ error: data.Error });

    const results = [];

    for (const item of data.Search) {
      const movie = await fetchAndCacheMovie(item.Title);
      if (genre && !movie.genre.includes(genre)) continue;
      results.push(movie);
    }

    results.sort((a, b) => (order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMovieStats = async (req, res) => {
  try {
    const movies = await Movie.find();

    const genreCount = {};
    const ratingByGenre = {};
    const countByGenre = {};
    const runtimeByYear = {};
    const countByYear = {};

    movies.forEach((movie) => {
      movie.genre.forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;

        ratingByGenre[g] = (ratingByGenre[g] || 0) + movie.rating;
        countByGenre[g] = (countByGenre[g] || 0) + 1;
      });

      if (movie.year && movie.runtime) {
        runtimeByYear[movie.year] = (runtimeByYear[movie.year] || 0) + movie.runtime;
        countByYear[movie.year] = (countByYear[movie.year] || 0) + 1;
      }
    });

    const avgRatingByGenre = Object.keys(ratingByGenre).map((g) => ({
      genre: g,
      avgRating: (ratingByGenre[g] / countByGenre[g]).toFixed(2),
    }));

    const avgRuntimeByYear = Object.keys(runtimeByYear).map((y) => ({
      year: y,
      avgRuntime: (runtimeByYear[y] / countByYear[y]).toFixed(2),
    })).sort((a, b) => a.year - b.year);

    res.json({
      genreCount,
      avgRatingByGenre,
      avgRuntimeByYear,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
};

// ✅ NEW: Refresh cache
const refreshStats = async (req, res) => {
  try {
    await Movie.deleteMany({});
    res.json({ message: 'Cache cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to refresh cache.' });
  }
};

// ✅ Export all controllers
module.exports = {
  getMoviesBySearch,
  getMovieById,
  getMovieStats,
  refreshStats
};
