import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Line } from 'react-chartjs-2';

const UserChart = () => {
  const { userId } = useParams();
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/user/${userId}/chart/`);
        const solveData = response.data;
        
        if (Array.isArray(solveData) && solveData.length > 0) {
          const labels = solveData.map(solve => new Date(solve.date).toLocaleDateString());
          const data = solveData.map(solve => solve.solvetime);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Solve Times',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
            ],
            options: {
              scales: {
                x: {
                  type: 'category',
                  ticks: {
                    callback: function(value, index, values) {
                      if (index === 0 || index === values.length - 1) {
                        return this.getLabelForValue(value);
                      }
                      return null;
                    }
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Time (seconds)'
                  }
                }
              }
            }
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
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>User's Solve Times Chart</h2>
      {chartData ? (
        <Line data={chartData} options={chartData.options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default UserChart;
