import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

export default function YieldLineChart({ curve }) {
  if (!curve) return null;

  const data = {
    labels: curve.time_hours.map((value) => `${value} h`),
    datasets: [
      {
        label: 'Yield (U/g)',
        data: curve.yield_u_per_g,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.45,
        fill: true,
        pointBackgroundColor: '#ec4899',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ec4899',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      y: {
        duration: 2000,
        from: 500,
        easing: 'easeOutQuart'
      }
    },
    plugins: { 
        legend: { display: true },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1e293b',
            bodyColor: '#334155',
            borderColor: 'rgba(0,0,0,0.05)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            cornerRadius: 12
        }
    },
    scales: { 
        y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
        x: { grid: { display: false } }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="h-72"
    >
      <Line data={data} options={options} />
    </motion.div>
  );
}
