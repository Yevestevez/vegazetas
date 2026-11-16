/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'sgbus-green': '#44D800',
                'dark-orange': '#FF8C00',
                'violet': '#7F00FF',
                'coquelicot': '#FF3800',
                'spring-bud': '#A7FC00',
                'veronica': '#AF0DD3',
                'folly': '#FF2B67',
                'canary': '#FFEB00',
                'aquamarine': '#00FFCE',
                'hot-magenta': '#FF1DCE'
            },
            screens: {
                'xs': '480px',
                '3xl': '1920px'
            },
            maxWidth: {
                '9xl': '1920px'
            },
            boxShadow: {
                'hard-sm': '0.2rem 0.2rem 0 rgba(0,0,0,0.8)',
                'hard-md': '0.3rem 0.3rem 0 rgba(0,0,0,0.8)',
                'hard-lg': '0.4rem 0.4rem 0 rgba(0,0,0,0.8)',
                'hard-xl': '0.5rem 0.5rem 0 rgba(0,0,0,0.8)',
                'hard-2xl': '0.6rem 0.6rem 0 rgba(0,0,0,0.8)',
            },
        },
    },
    plugins: [],
}