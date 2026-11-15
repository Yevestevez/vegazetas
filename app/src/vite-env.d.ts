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

export {}
