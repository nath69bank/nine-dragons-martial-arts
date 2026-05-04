import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      keyframes: {
        'dragon-breathe': {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 8px rgba(201,161,74,0.4))' },
          '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 22px rgba(201,161,74,0.85))' },
        },
        'dragon-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'scale-drift': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 200%' },
        },
        'scroll-line': {
          '0%': { height: '0%', opacity: '1' },
          '70%': { height: '100%', opacity: '1' },
          '100%': { height: '100%', opacity: '0' },
        },
      },
      animation: {
        'dragon-breathe': 'dragon-breathe 4s ease-in-out infinite',
        'dragon-float': 'dragon-float 6s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        'scale-drift': 'scale-drift 40s linear infinite',
        'scroll-line': 'scroll-line 2s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
} satisfies Config
