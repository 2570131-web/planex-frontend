/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          50: '#f0f4ff', 100: '#dce6ff', 200: '#b9ccff',
          300: '#7a9fff', 400: '#3a6eff', 500: '#0a3fd4',
          600: '#0030b0', 700: '#00248c', 800: '#001c6e',
          900: '#0a1628', 950: '#060e1a',
        },
        gold: {
          50: '#fefce8', 100: '#fef9c3', 200: '#fef08a',
          300: '#fde047', 400: '#f0c040', 500: '#e8a000',
          600: '#ca7a00', 700: '#a15700', 800: '#854200', 900: '#713300',
        },
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-up':  'slideUp 0.5s ease forwards',
        'float':     'float 6s ease-in-out infinite',
        'ticker':    'ticker 35s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                          to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' },    '50%': { transform: 'translateY(-10px)' } },
        ticker:  { '0%': { transform: 'translateX(0)' },         '100%': { transform: 'translateX(-50%)' } },
      },
      backgroundImage: {
        'hero-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0c040' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
