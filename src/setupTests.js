// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Node 25+ ships its own localStorage global, which is undefined unless Node
// runs with --localstorage-file, and it shadows jsdom's. Restore jsdom's.
if (globalThis.jsdom && globalThis.localStorage === undefined) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: globalThis.jsdom.window.localStorage,
    configurable: true,
    writable: true,
  });
}
