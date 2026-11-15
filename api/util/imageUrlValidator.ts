const BLOCKED_DOMAINS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]'
]

const BLOCKED_RANGES = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^169\.254\./
]

export function isValidImageUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString)
        
        if (!['http:', 'https:'].includes(url.protocol)) {
            return false
        }
        
        const hostname = url.hostname
        
        if (BLOCKED_DOMAINS.includes(hostname)) {
            return false
        }
        
        if (BLOCKED_RANGES.some(range => range.test(hostname))) {
            return false
        }
        
        return true
    } catch {
        return false
    }
}

export const ALLOWED_IMAGE_DOMAINS = [
    'imgur.com',
    'i.imgur.com',
    'cloudinary.com',
    'res.cloudinary.com',
    'images.unsplash.com',
    'cdn.example.com'
]

export function isAllowedImageDomain(urlString: string, allowedDomains = ALLOWED_IMAGE_DOMAINS): boolean {
    try {
        const url = new URL(urlString)
        const hostname = url.hostname.toLowerCase()
        
        return allowedDomains.some(domain => 
            hostname === domain || hostname.endsWith('.' + domain)
        )
    } catch {
        return false
    }
}
