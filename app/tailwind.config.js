/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'sgbus-green': 'var(--color-sgbus-green)',
                'dark-orange': 'var(--color-dark-orange)',
                'violet': 'var(--color-violet)',
                'coquelicot': 'var(--color-coquelicot)',
                'spring-bud': 'var(--color-spring-bud)',
                'veronica': 'var(--color-veronica)',
                'folly': 'var(--color-folly)',
                'canary': 'var(--color-canary)',
                'aquamarine': 'var(--color-aquamarine)',
                'hot-magenta': 'var(--color-hot-magenta)'
            },
        },
    },
    plugins: [],
}