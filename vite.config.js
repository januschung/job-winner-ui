import { existsSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// index.html loads /config.js, which only the Docker entrypoint generates
// (from public/config.template.js). Outside Docker, serve an empty config so
// the app falls back to its default backend URL instead of a 404, unless a
// local public/config.js exists.
const devAppConfig = () => {
  // Returns nothing: Vite would run a returned function as a post hook.
  const serveEmptyConfig = server => {
    server.middlewares.use('/config.js', (req, res, next) => {
      if (existsSync('public/config.js')) return next();
      res.setHeader('Content-Type', 'text/javascript');
      res.end('window.APP_CONFIG = window.APP_CONFIG || {};\n');
    });
  };
  return {
    name: 'dev-app-config',
    configureServer: serveEmptyConfig,
    configurePreviewServer: serveEmptyConfig,
  };
};

export default defineConfig({
  base: './',
  plugins: [react(), devAppConfig()],
  build: {
    rolldownOptions: {
      output: {
        // Long-cacheable vendor chunks for what the first page needs, so app
        // releases only invalidate the app's own code. `$initial` keeps
        // dialog-only dependencies (e.g. the date pickers) in the lazily
        // loaded dialog chunks instead of the startup download.
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              tags: ['$initial'],
            },
            {
              name: 'mui',
              test: /node_modules[\\/](@mui|@emotion|@popperjs)[\\/]/,
              tags: ['$initial'],
            },
            {
              name: 'apollo',
              test: /node_modules[\\/](@apollo|graphql|rxjs|@wry|optimism|tslib)[\\/]/,
              tags: ['$initial'],
            },
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    setupFiles: ['./src/setupTests.js'],
  },
});
