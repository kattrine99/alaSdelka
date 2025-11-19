/** @type {import('tailwindcss').Config} */
import animatePlugin from 'tailwindcss-animate';

import lineClamp from "@tailwindcss/line-clamp";

export default ({
    mode: 'jit',
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
            animation: {
                'fade-in': 'fade-in 0.4s ease-out',
                'fade-in-down': 'fade-in-down 0.5s ease-out',
                'fade-in-slow': 'fade-in-down 1s ease-out'
            },
            keyframes: {
                'fade-in-slow': {
                    '0%': { opacity: 0 },
                    '50%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                'fade-in-down': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
        },
    },
    plugins: [animatePlugin, lineClamp],
});
