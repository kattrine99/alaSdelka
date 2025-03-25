/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./Pages/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {

            colors: {
                greenBrand: '#28B13D',
                'green-brand-dark': '#219834',
                'green-brand-light': '#4CDA61',
            }
        },
    },
    safelist: ['text-green-brand'],
    plugins: [],
};
