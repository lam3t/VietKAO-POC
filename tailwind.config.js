/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vietkao: {
          light: '#a4d4e3',
          DEFAULT: '#5cb0cc', // VietKAO Center cyan/blue
          dark: '#173645', // VietKAO Center navy dark
          50: '#f0f7f9',
          100: '#dbeff3',
          500: '#5cb0cc',
          600: '#479ab7',
          900: '#173645',
        },
        vietkaogreen: {
          DEFAULT: '#6eb838', // VietKAO Center green
          dark: '#58942b',
        },
        amigos: {
          light: '#3b82f6',
          DEFAULT: '#1e40af', // Amigos Camp corporate dark blue
          dark: '#1e3a8a',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        }
      }
    },
  },
  plugins: [],
}
