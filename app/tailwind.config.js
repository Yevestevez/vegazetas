/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
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
        },
    },
    safelist: [
        {
            pattern: /(bg|text|hover:bg|hover:text)-(sgbus-green|dark-orange|violet|coquelicot|spring-bud|veronica|folly|canary|aquamarine|hot-magenta)/,
        }
    ],
    plugins: [],
}