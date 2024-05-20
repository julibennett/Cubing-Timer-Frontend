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
          const labels = solveData.map(solve => new Date(solve.date).toLocaleDateString());
          const data = solveData.map(solve => solve.solvetime);

          const thresholds = [3, 6, 9, 12, 15, 18];
          const pieData = thresholds.map((threshold, index) => {
            if (index === 0) {
              return solveData.filter(solve => solve.solvetime < threshold).length;
            }
            return solveData.filter(solve => solve.solvetime >= thresholds[index - 1] && solve.solvetime < threshold).length;
          });

          pieData.push(solveData.filter(solve => solve.solvetime >= thresholds[thresholds.length - 1]).length);

          const pieColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
            '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#AC64AD',
            '#64E572', '#FFB300', '#FF8A65', '#E57373', '#BA68C8', '#FFD54F', 
            '#4CAF50', '#81C784', '#90A4AE'
          ];

          setChartData({
            labels,
            datasets: [
              {
                label: 'Solve Times',
                data,
                backgroundColor: 'rgba(250, 226, 104, 2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
              },
            ],
            pieData: {
              labels: [
                ...thresholds.map((threshold, index) => {
                  if (index === 0) {
                    return `<${threshold}s`;
                  }
                  if (threshold <= 15) {
                    return `${thresholds[index - 1]}-${threshold}s`;
                  }
                  return `${threshold - 10}-${threshold}s`;
                }),
                `>${thresholds[thresholds.length - 1]}s`
              ],
              datasets: [
                {
                  data: pieData,
                  backgroundColor: pieColors.slice(0, pieData.length),
                },
              ],
            },
            options: {
              scales: {
                x: {
                  type: 'category',
                  ticks: {
                    callback: function(value, index, values) {
                      // Show the first and last label
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
  }, []);

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4 text-center">Solve Times Chart</h2>
      <div className="flex justify-center space-x-4 mb-8">
        <button onClick={() => handleChartTypeChange('line')} className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Line Chart</button>
        <button onClick={() => handleChartTypeChange('bar')} className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Bar Chart</button>
        <button onClick={() => handleChartTypeChange('pie')} className={`px-4 py-2 rounded ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Pie Chart</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        {chartData ? (
          chartType === 'line' ? (
            <Line data={chartData} options={chartData.options} />
          ) : chartType === 'bar' ? (
            <Bar data={chartData} options={chartData.options} />
          ) : (
            <Pie data={chartData.pieData} />
          )
        ) : (
          <p className="text-center">Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default Chart;
