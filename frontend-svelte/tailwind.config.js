/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        serif: ['Roboto Slab', 'serif']
      }
    },
    container: {
      center: true,
      padding: '1rem'
    }
  },
  plugins: []
};
