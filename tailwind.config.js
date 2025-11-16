/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00ffff',
          fuchsia: '#ff00ff',
          emerald: '#00ff88',
        },
        dark: {
          bg: '#050816',
          panel: '#0a0f1f',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'glow-fuchsia': '0 0 20px rgba(255, 0, 255, 0.5)',
        'glow-emerald': '0 0 20px rgba(0, 255, 136, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

