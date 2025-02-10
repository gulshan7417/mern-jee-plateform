// frontend/components/PerformanceChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const PerformanceChart = ({ data }) => {
  const chartData = {
    labels: data.labels, // e.g., subjects or topics
    datasets: [{
      label: 'Marks',
      data: data.marks,
      backgroundColor: 'rgba(75,192,192,0.6)',
    }]
  };

  return <Bar data={chartData} />;
};

export default PerformanceChart;
