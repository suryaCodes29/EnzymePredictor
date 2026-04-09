import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function DecompositionChart({ chart }) {
  if (!chart) return null;

  const data = {
    labels: chart.time_days.map((value) => `${value} d`),
    datasets: chart.series.map((series) => ({
      label: series.enzyme,
      data: series.values,
      borderColor: series.color,
      backgroundColor: series.color,
      tension: 0.35,
      pointRadius: 2
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Decomposition efficiency (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
}
