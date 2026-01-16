// eslint.config.js
'use strict';

const pluginJs = require("@eslint/js");
const reactPlugin = require('eslint-plugin-react');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  pluginJs.configs.recommended,
  reactPlugin.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  reactPlugin.configs.flat['jsx-runtime'], // Add this if you are using React 17+
  {
    plugins: {
      js: pluginJs,
      react: reactPlugin,
    }
  },
  {
    files: ["src/**/*.js"],
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  prettierConfig, // Must be last to override other configs
];
