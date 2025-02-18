// eslint.config.js
'use strict';

const pluginJs = require("@eslint/js");
const reactPlugin = require('eslint-plugin-react');
const globals = require('globals');

module.exports = [
  pluginJs.configs.recommended,
  {
    plugins: {
      js: pluginJs,
      react: reactPlugin,
    }
  },
  {
    files: ["src/**/*.js"],
    ...reactPlugin.configs.flat.recommended,
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
];
