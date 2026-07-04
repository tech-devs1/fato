/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        terracotta: {
          50: '#FEF2EE',
          100: '#FDE6DE',
          200: '#FBC9B6',
          300: '#F8A68E',
          400: '#F47A5F',
          500: '#C05621',
          600: '#9A4319',
          700: '#7A3414',
          800: '#622911',
          900: '#51210F',
        },
        forest: {
          50: '#F2F8F4',
          100: '#E1F0E5',
          200: '#C3E0CC',
          300: '#94C6A8',
          400: '#5FA87F',
          500: '#2D8B5C',
          600: '#236E49',
          700: '#1C563A',
          800: '#174530',
          900: '#133929',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FFF7CC',
          200: '#FFE999',
          300: '#FFD966',
          400: '#FFC433',
          500: '#E6A800',
          600: '#B88600',
          700: '#916B00',
          800: '#745500',
          900: '#5E4500',
        },
        earth: {
          50: '#F9F6F3',
          100: '#F0E9E2',
          200: '#E0D0C4',
          300: '#C9B2A0',
          400: '#AE8F78',
          500: '#947055',
          600: '#775944',
          700: '#604637',
          800: '#4E3A2E',
          900: '#413127',
        },
        ivory: {
          50: '#FFFEF7',
          100: '#FFFEF0',
          200: '#FFFCDE',
          300: '#FFF9C2',
          400: '#FFF6A5',
          500: '#FFF388',
          600: '#FFE26E',
          700: '#FFCC55',
          800: '#FFB844',
          900: '#FFA838',
        },
        sunset: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.07)',
        'glass-lg': '0 16px 64px 0 rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
