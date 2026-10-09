import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          bg: 'var(--clay-bg)',
          card: 'var(--clay-card)',
          pressed: 'var(--clay-pressed)',
          border: 'var(--clay-border)',
          text: 'var(--clay-text)',
          muted: 'var(--clay-muted)',
          shadowOuterDark: 'var(--clay-shadow-outer-dark)',
          shadowOuterLight: 'var(--clay-shadow-outer-light)',
          shadowInnerLight: 'var(--clay-shadow-inner-light)',
          shadowInnerDark: 'var(--clay-shadow-inner-dark)',
        },
        coral: {
          DEFAULT: '#FF7A59',
          light: '#FF9478',
          dark: '#E05F3F',
        },
        teal: {
          DEFAULT: '#2EC4B6',
          light: '#53D6CA',
          dark: '#229E92',
        },
        sun: {
          DEFAULT: '#FFC857',
          light: '#FFD478',
          dark: '#E5AF3E',
        },
        indigo: {
          DEFAULT: '#5B6CFF',
          light: '#7A88FF',
          dark: '#4554DB',
        },
        risk: {
          green: '#22C55E',
          amber: '#F59E0B',
          red: '#EF4444',
          critical: '#DC2626',
        },
      },
      fontFamily: {
        heading: ['var(--font-oxanium)', 'Oxanium', 'sans-serif'],
        body: ['var(--font-oxanium)', 'Oxanium', 'sans-serif'],
        sans: ['var(--font-oxanium)', 'Oxanium', 'sans-serif'],
        mono: ['var(--font-oxanium)', 'Oxanium', 'monospace'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
        'clay': '28px',
        'clay-sm': '20px',
        'clay-lg': '36px',
        'clay-full': '9999px',
      },
      boxShadow: {
        'clay-card': 'var(--shadow-clay-card)',
        'clay-card-hover': 'var(--shadow-clay-card-hover)',
        'clay-card-pressed': 'var(--shadow-clay-card-pressed)',
        'clay-btn': 'var(--shadow-clay-btn)',
        'clay-btn-hover': 'var(--shadow-clay-btn-hover)',
        'clay-btn-pressed': 'var(--shadow-clay-btn-pressed)',
        'clay-input': 'var(--shadow-clay-input)',
        'clay-badge': 'var(--shadow-clay-badge)',
        'clay-pill': 'var(--shadow-clay-pill)',
        'clay-coral': 'var(--shadow-clay-coral)',
        'clay-teal': 'var(--shadow-clay-teal)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
