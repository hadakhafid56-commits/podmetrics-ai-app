/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        rb: {
          950: '#0B0F17',
          900: '#0F1420',
          850: '#131927',
          800: '#1A2030',
          700: '#242B3D',
          600: '#323B52',
          500: '#4A5470',
          400: '#6B7590',
          300: '#9BA3BA',
          200: '#C8CDDC',
          100: '#E8EBF2',
        },
        brand: {
          500: '#8B5CF6',
          400: '#A78BFA',
          600: '#7C3AED',
          300: '#C4B5FD',
        },
        cyan: {
          500: '#06B6D4',
          400: '#22D3EE',
          600: '#0891B2',
          300: '#67E8F9',
        },
        emerald: {
          500: '#10B981',
          400: '#34D399',
          600: '#059669',
        },
        danger: {
          500: '#EF4444',
          400: '#F87171',
        },
        amber: {
          500: '#F59E0B',
          400: '#FBBF24',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
