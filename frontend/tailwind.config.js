/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-open-sans)'],
                mono: ['var(--font-roboto-mono)'],
            },
        },
        container: {
            center: true,
            padding: '1rem',
        },
    },
    plugins: [],
};
