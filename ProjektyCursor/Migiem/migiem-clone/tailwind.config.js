/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        migiem: {
          navy: '#0a192f',       // Ciemny granat (tekst nagłówków)
          text: '#1e293b',       // Główny tekst
          light: '#64748b',      // Szary tekst pomocniczy
          bg: '#f8fafc',         // Tło strony
          accent: '#ff4757',     // Koralowy (rzadko używany, ale jest)
        }
      },
      backgroundImage: {
        'migiem-gradient': 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)', // Główny cyjanowo-niebieski
        'migiem-secondary': 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', // Ciemniejszy gradient
      }
    },
  },
  plugins: [],
}