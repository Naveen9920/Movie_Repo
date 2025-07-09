const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const DBConnection = require('./database/db');
const movieRoutes = require('./routes/movieRoutes');

dotenv.config();
DBConnection();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
