declare global {
    interface Storage {
        token?: string
    }

    interface ImportMeta {
        env: {
            VITE_API_URL: string
        }
    }
}

declare module '*.css' {
    const css: string
    export default css
}

export {}
