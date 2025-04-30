/** @type {import('tailwindcss').Config} */

export default ({
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./Pages/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                openSans: ['"Open Sans"', 'sans-serif'],
                Urbanist: ["Urbanist", 'sans-serif'],
                actay: ['"Actay Wide"', 'sans-serif'],
            },
            colors: {
                'main-green': "#2EAA7B",
                'main-green1': "#31B683",
                'dark-green': '#16503A',
                white: "#FFFFFF",
                black: "#191919",
                gray: "#787878",
            },
        },
    },
    plugins: [],
});
