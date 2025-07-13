/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1db954',
          black: '#191414',
          gray: '#121212',
          lightGray: '#282828',
          darkGray: '#181818'
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite'
      }
    }
  },
  plugins: [],
};
