import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend
);

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies/stats`);
        setStats(res.data);
      } catch (err) {
        alert("Failed to fetch stats.");
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p style={{ padding: '20px' }}>Loading stats...</p>;

  const sectionStyle = {
    marginBottom: '50px',
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    padding: '10px 16px',
    marginRight: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: '40px', maxWidth: '960px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>🎬 Movie Analytics Dashboard</h1>

      {/* Pie Chart: Genre Distribution */}
      <div style={sectionStyle}>
        <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>🎯 Genres Distribution</h2>
        <Pie
          data={{
            labels: Object.keys(stats.genreCount),
            datasets: [{
              label: 'Genre Count',
              data: Object.values(stats.genreCount),
              backgroundColor: [
                '#f87171', '#60a5fa', '#34d399', '#fbbf24',
                '#c084fc', '#f472b6', '#4ade80', '#38bdf8',
              ],
            }],
          }}
        />
      </div>

      {/* Bar Chart: Avg Ratings by Genre */}
      <div style={sectionStyle}>
        <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>⭐ Average Ratings by Genre</h2>
        <Bar
          data={{
            labels: stats.avgRatingByGenre.map(g => g.genre),
            datasets: [{
              label: 'Avg Rating',
              data: stats.avgRatingByGenre.map(g => g.avgRating),
              backgroundColor: '#3b82f6',
            }],
          }}
        />
      </div>

      {/* Line Chart: Avg Runtime by Year */}
      <div style={sectionStyle}>
        <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>⏱ Average Runtime by Year</h2>
        <Line
          data={{
            labels: stats.avgRuntimeByYear.map(y => y.year),
            datasets: [{
              label: 'Avg Runtime (min)',
              data: stats.avgRuntimeByYear.map(y => y.avgRuntime),
              borderColor: '#10b981',
              tension: 0.3,
              fill: false,
            }],
          }}
        />
      </div>

      {/* Refresh and Logout Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={async () => {
            try {
              const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/movies/refresh`);
              alert(res.data.message);
              window.location.reload();
            } catch {
              alert('Failed to refresh stats.');
            }
          }}
          style={buttonStyle}
        >
           Refresh Stats
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          style={{ ...buttonStyle, backgroundColor: '#ef4444' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StatsDashboard;
