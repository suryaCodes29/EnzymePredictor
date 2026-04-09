/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.12)'
      },
      colors: {
        pastel: {
          blue: '#bfdbfe',
          lavender: '#e9d5ff',
          mint: '#a7f3d0',
          pink: '#fbcfe8'
        },
        brand: {
          50: '#eefcf6',
          100: '#d5f7e6',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534'
        },
        enzyme: {
          protease: '#ec4899',
          amylase: '#06b6d4',
          cellulase: '#10b981',
          lipase: '#f97316'
        }
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(167,243,208,0.4), transparent 45%), radial-gradient(circle at top right, rgba(191,219,254,0.4), transparent 40%), radial-gradient(circle at bottom, rgba(233,213,255,0.4), transparent 45%)'
      }
    }
  },
  plugins: []
};
