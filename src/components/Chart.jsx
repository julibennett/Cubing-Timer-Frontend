import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line'); 
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/solves/chart-data/');
        const solveData = response.data;

        
        if (Array.isArray(solveData) && solveData.length > 0) {
          const labels = solveData.map(solve => solve.date);
          const data = solveData.map(solve => solve.solvetime);

         
          const thresholds = [1, 2, 3, 4, 5]; 
          const pieData = thresholds.map((threshold, index) => {
            if (index === 0) {
              return solveData.filter(solve => solve.solvetime < threshold).length;
            }
            return solveData.filter(solve => solve.solvetime >= thresholds[index - 1] && solve.solvetime < threshold).length;
          });

          
          pieData.push(solveData.filter(solve => solve.solvetime >= thresholds[thresholds.length - 1]).length);

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
            pieData: {
              labels: [...thresholds.map((threshold, index) => {
                if (index === 0) {
                  return `<${threshold}s`;
                }
                return `${thresholds[index - 1]}-${threshold}s`;
              }), `>${thresholds[thresholds.length - 1]}s`],
              datasets: [
                {
                  data: pieData,
                  backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                  ],
                },
              ],
            },
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

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Solve Times Chart</h2>
      <div>
        <button onClick={() => handleChartTypeChange('line')}>Line Chart</button>
        <button onClick={() => handleChartTypeChange('bar')}>Bar Chart</button>
        <button onClick={() => handleChartTypeChange('pie')}>Pie Chart</button>
      </div>
      {chartData ? (
        chartType === 'line' ? (
          <Line data={chartData} />
        ) : chartType === 'bar' ? (
          <Bar data={chartData} />
        ) : (
          <Pie data={chartData.pieData} />
        )
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Chart;
