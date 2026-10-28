/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Noto Sans"',
          'Ubuntu',
          '"Droid Sans"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      colors: {
        ds: {
          text: '#172B4D',
          subtle: '#44546F',
          subtlest: '#626F86',
          brand: '#0C66E4',
          'brand-hovered': '#0055CC',
          'brand-pressed': '#09326C',
          nav: '#1D2125',
          'nav-hover': 'rgba(161, 189, 217, 0.08)',
          'nav-selected': 'rgba(255, 255, 255, 0.12)',
          surface: '#FFFFFF',
          canvas: '#F7F8F9',
          input: '#F1F2F4',
          border: 'rgba(9, 30, 66, 0.14)',
          success: '#1F845A',
          'success-bolder': '#DCFFF1',
          danger: '#C9372C',
          'danger-bolder': '#FFECEB',
          warning: '#E56910',
          discovery: '#6E5DC6',
          information: '#0C66E4',
        },
      },
      borderRadius: {
        ds: '3px',
        'ds-lg': '8px',
      },
      boxShadow: {
        overlay: '0 8px 12px #091E4226, 0 0 1px #091E424F',
      },
    },
  },
  plugins: [],
};
