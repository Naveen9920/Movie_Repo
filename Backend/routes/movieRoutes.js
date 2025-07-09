// routes/movieRoutes.js
const express = require('express');
const {
  getMoviesBySearch,
  getMovieById,
  getMovieStats,
  refreshStats
} = require('../controllers/moviecontroller');

const router = express.Router();

router.get('/', getMoviesBySearch);
router.get('/stats', getMovieStats);
router.post('/refresh', refreshStats); // ✅ Only keep this
router.get('/:id', getMovieById);

module.exports = router;
