import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api/daily_papers': {
        target: 'https://huggingface.co',
        changeOrigin: true,
        secure: true,
      },
      '/api/news': {
        target: 'https://news.google.com',
        changeOrigin: true,
        secure: true,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api\/news/, '/rss/search'),
      },
    },
  },
});
