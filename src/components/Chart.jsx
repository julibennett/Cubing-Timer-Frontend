import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import api from '../api'; 

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/solves/chart-data/');
        const solveData = response.data;
        
        
        if (Array.isArray(solveData) && solveData.length > 0) {
          const labels = solveData.map(solve => solve.date);
          const data = solveData.map(solve => solve.solvetime);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Solve Times',
                data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
            ],
          });
        } else {
          setError('No solve data available');
        }
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className='text-center'>Solve Times Chart</h2>
      {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default Chart;
