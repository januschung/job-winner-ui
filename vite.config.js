import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
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
