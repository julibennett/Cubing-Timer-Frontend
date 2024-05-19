import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../api'

const Chart = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await api.get('/api/solves/');
          const solves = response.data;
  
          const labels = solves.map(solve => new Date(solve.date).toLocaleDateString());
          const data = solves.map(solve => solve.solvetime);
  
          setChartData({
            labels,
            datasets: [
              {
                label: 'Solve Times',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
        } catch (err) {
          console.error('Failed to fetch solve times', err);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <h2>Solve Time Chart</h2>
        <Line data={chartData} />
      </div>
  )
}

export default Chart