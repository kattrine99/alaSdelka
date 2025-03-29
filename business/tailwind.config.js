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
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                openSans: ['"Open Sans"', 'sans-serif'],
                Urbanist: ["Urbanist", 'sans-serif'],
            },
        },
    },
    safelist: ['text-green-brand'],
    plugins: [],
};
