
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        library: {
          navy: '#1e293b',
          indigo: '#312e81',
          amber: '#d97706',
          amberLight: '#f59e0b',
          cream: '#faf7f2',
          creamDark: '#f5f0e8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 6px -1px rgba(146, 114, 84, 0.1), 0 2px 4px -1px rgba(146, 114, 84, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(146, 114, 84, 0.1), 0 4px 6px -2px rgba(146, 114, 84, 0.05)',
      }
    },
  },
  plugins: [],
}
