** Full-stack movie analysis dashboard using React, Node.js, Express, MongoDB, and OMDb API(MERN STACK). 


** Features:

Search movies by title

Stats dashboard: average ratings, genres, runtime

OMDb API caching to MongoDB

Admin login

Responsive design with charts and filters


** Live Demo: 

https://www.loom.com/share/fcd3cafa454c4f088a14414e88298b9e

** Backend**

cd backend

npm install

cp .env.example .env   # Fill in your OMDB_KEY and MongoDB URI

backend/.env.example--

OMDB_API_KEY=your_omdb_key

MONGODB_URI=mongodb+srv://your-mongo-uri

npm run dev


** FrontEnd** 


cd frontend

npm install

cp .env.example .env   # Add BACKEND_URL as your Render API URL

BACKEND_URL=https://your-backend-url

npm run dev


** To access /stats:



Username: admin

Password: 123456
