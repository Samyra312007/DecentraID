/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coinbase Design System Colors
        primary: {
          DEFAULT: '#0052ff',
          active: '#003ecc',
          disabled: '#a8b8cc',
        },
        ink: '#0a0b0d',
        body: {
          DEFAULT: '#5b616e',
          strong: '#0a0b0d',
        },
        muted: {
          DEFAULT: '#7c828a',
          soft: '#a8acb3',
        },
        hairline: {
          DEFAULT: '#dee1e6',
          soft: '#eef0f3',
        },
        canvas: '#ffffff',
        surface: {
          soft: '#f7f7f7',
          card: '#ffffff',
          strong: '#eef0f3',
          dark: '#0a0b0d',
          'dark-elevated': '#16181c',
        },
        on: {
          primary: '#ffffff',
          dark: {
            DEFAULT: '#ffffff',
            soft: '#a8acb3',
          },
        },
        semantic: {
          up: '#05b169',
          down: '#cf202f',
        },
        accent: {
          yellow: '#f4b000',
        },
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-mega': ['5rem', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-xl': ['4rem', { lineHeight: '1.0', letterSpacing: '-0.016em', fontWeight: '400' }],
        'display-lg': ['3.25rem', { lineHeight: '1.0', letterSpacing: '-0.013em', fontWeight: '400' }],
        'display-md': ['2.75rem', { lineHeight: '1.09', letterSpacing: '-0.01em', fontWeight: '400' }],
        'display-sm': ['2.25rem', { lineHeight: '1.11', letterSpacing: '-0.005em', fontWeight: '400' }],
        'title-lg': ['2rem', { lineHeight: '1.13', letterSpacing: '-0.004em', fontWeight: '400' }],
        'title-md': ['1.125rem', { lineHeight: '1.33', letterSpacing: '0', fontWeight: '600' }],
        'title-sm': ['1rem', { lineHeight: '1.25', letterSpacing: '0', fontWeight: '600' }],
        'body-md': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'body-strong': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'caption-strong': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }],
        'number-display': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'button': ['1rem', { lineHeight: '1.15', letterSpacing: '0', fontWeight: '600' }],
        'nav-link': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
      },
      borderRadius: {
        'none': '0px',
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'pill': '100px',
      },
      spacing: {
        'xxs': '4px',
        'xs': '8px',
        'sm': '12px',
        'base': '16px',
        'md': '20px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
        'section': '96px',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
