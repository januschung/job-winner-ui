// eslint.config.js
'use strict';

const pluginJs = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  pluginJs.configs.recommended,
  reactPlugin.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  reactPlugin.configs.flat['jsx-runtime'], // Add this if you are using React 17+
  jsxA11y.flatConfigs.recommended,
  {
    plugins: {
      js: pluginJs,
      react: reactPlugin,
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.builtin,
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    // Vitest runs with `globals: true` (see vite.config.js).
    files: [
      'src/**/__tests__/**',
      'src/**/*.test.{js,jsx}',
      'src/setupTests.js',
    ],
    languageOptions: {
      globals: { ...globals.vitest, ...globals.node },
    },
  },
  {
    // Playwright UI tests: Node, plus browser code inside page.evaluate().
    files: ['ui-tests/**/*.js', 'playwright.config.js'],
    settings: { react: { version: 'detect' } },
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // Plain JS project without the prop-types package; prop checking would
    // come from TypeScript rather than runtime PropTypes.
    rules: { 'react/prop-types': 'off' },
  },
  prettierConfig, // Must be last to override other configs
];
