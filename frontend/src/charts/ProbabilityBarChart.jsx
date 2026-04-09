import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const getEnzymeColor = (enzyme) => {
  const norm = enzyme.toLowerCase();
  if (norm.includes('amylase')) return 'rgba(6, 182, 212, 0.85)';
  if (norm.includes('protease')) return 'rgba(236, 72, 153, 0.85)';
  if (norm.includes('cellulase')) return 'rgba(16, 185, 129, 0.85)';
  if (norm.includes('lipase')) return 'rgba(249, 115, 22, 0.85)';
  return 'rgba(139, 92, 246, 0.85)';
};

export default function ProbabilityBarChart({ items = [] }) {
  const data = {
    labels: items.map((item) => item.enzyme),
    datasets: [
      {
        label: 'Suitability (%)',
        data: items.map((item) => item.probability),
        backgroundColor: items.map((item) => getEnzymeColor(item.enzyme)),
        borderColor: items.map((item) => getEnzymeColor(item.enzyme).replace('0.85', '1')),
        borderWidth: 2,
        borderRadius: 16
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
      delay: (context) => context.dataIndex * 150
    },
    plugins: { 
        legend: { display: false },
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
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-72"
    >
      <Bar data={data} options={options} />
    </motion.div>
  );
}
