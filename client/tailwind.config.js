/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50:'#f0f4ff', 100:'#e0e9ff', 200:'#c7d6fe', 300:'#a5b9fc', 400:'#8196f8', 500:'#6071f1', 600:'#4f46e5', 700:'#4338ca', 800:'#3730a3', 900:'#312e81', 950:'#1e1b5e' },
        violet:  { 50:'#f5f3ff', 100:'#ede9fe', 500:'#8b5cf6', 600:'#7c3aed', 700:'#6d28d9' },
        indigo:  { 50:'#eef2ff', 500:'#6366f1', 600:'#4f46e5' },
        success: { 50:'#f0fdf4', 100:'#dcfce7', 300:'#86efac', 500:'#22c55e', 600:'#16a34a', 700:'#15803d', 800:'#166534', 900:'#14532d' },
        warning: { 50:'#fffbeb', 100:'#fef3c7', 300:'#fcd34d', 500:'#f59e0b', 600:'#d97706', 700:'#b45309', 800:'#92400e', 900:'#78350f' },
        danger:  { 50:'#fef2f2', 100:'#fee2e2', 300:'#fca5a5', 500:'#ef4444', 600:'#dc2626', 700:'#b91c1c', 800:'#991b1b', 900:'#7f1d1d' },
        dark:    { 800:'#1e293b', 900:'#0f172a', 950:'#020617' },
      },
      fontFamily: {
        sans: ['Inter','system-ui','sans-serif'],
        display: ['Inter','system-ui','sans-serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 8px 25px -5px rgb(0 0 0 / 0.12), 0 4px 10px -6px rgb(0 0 0 / 0.08)',
        'glow':       '0 0 40px -10px rgb(79 70 229 / 0.4)',
        'glow-sm':    '0 0 20px -5px rgb(79 70 229 / 0.3)',
        'primary':    '0 4px 14px 0 rgb(79 70 229 / 0.35)',
        'primary-lg': '0 8px 30px 0 rgb(79 70 229 / 0.4)',
        'glass':      '0 8px 32px 0 rgb(31 38 135 / 0.15)',
        'float':      '0 20px 60px -10px rgb(0 0 0 / 0.2)',
        'inner-glow': 'inset 0 1px 0 rgb(255 255 255 / 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-aurora': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
        'gradient-ocean':  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'gradient-forest': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 2s infinite',
        'slide-up':   'slideUp 0.4s ease forwards',
        'slide-in':   'slideIn 0.3s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'scale-in':   'scaleIn 0.25s ease forwards',
        'bounce-in':  'bounceIn 0.5s ease forwards',
      },
      keyframes: {
        float:     { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-10px)' } },
        slideUp:   { from:{ opacity:'0', transform:'translateY(16px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        slideIn:   { from:{ opacity:'0', transform:'translateX(-12px)' }, to:{ opacity:'1', transform:'translateX(0)' } },
        fadeIn:    { from:{ opacity:'0' }, to:{ opacity:'1' } },
        scaleIn:   { from:{ opacity:'0', transform:'scale(0.95)' }, to:{ opacity:'1', transform:'scale(1)' } },
        bounceIn:  { '0%':{ opacity:'0', transform:'scale(0.8)' }, '70%':{ transform:'scale(1.05)' }, '100%':{ opacity:'1', transform:'scale(1)' } },
        shimmer:   { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
      },
      borderRadius: { 'xl':'0.75rem', '2xl':'1rem', '3xl':'1.5rem', '4xl':'2rem' },
    }
  },
  plugins: []
}
