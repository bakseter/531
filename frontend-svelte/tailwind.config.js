/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)'],
        mono: ['var(--font-roboto-mono)']
      }
    },
    container: {
      center: true,
      padding: '1rem'
    }
  },
  plugins: []
};
