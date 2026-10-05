import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.igdb.com https://res.cloudinary.com https://img.youtube.com https://i.ytimg.com https://lh3.googleusercontent.com https://cdn.discordapp.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.cloudinary.com",
  'frame-src https://www.youtube-nocookie.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ')

function securityMetaTags(): Plugin {
  return {
    name: 'security-meta-tags',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: CONTENT_SECURITY_POLICY
          },
          injectTo: 'head-prepend'
        },
        {
          tag: 'meta',
          attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' },
          injectTo: 'head-prepend'
        }
      ]
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), securityMetaTags()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
