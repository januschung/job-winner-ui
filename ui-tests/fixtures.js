import AxeBuilder from '@axe-core/playwright';
import { test as base, expect } from '@playwright/test';

// Demo data dates are relative to today; a fixed clock keeps dates, badges
// and screenshots identical from run to run.
export const NOW = new Date('2026-06-15T10:00:00-07:00');

export const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      // /config.js is generated only by the Docker entrypoint; dev 404s it.
      const isConfig404 = message.location().url.endsWith('/config.js');
      if (message.type() === 'error' && !isConfig404) {
        errors.push(message.text());
      }
    });
    await page.clock.setFixedTime(NOW);
    await use(page);
    expect(errors, 'errors in the page or console').toEqual([]);
  },
});

export { expect };

// Opens the app against the mock API. `params` become mock knobs such as
// { 'mock-fail': 'DeleteJobApplication' } or { 'mock-data': 'empty' }.
export async function openApp(page, params = {}, { waitForCards = true } = {}) {
  const search = new URLSearchParams({ 'mock-delay': '50', ...params });
  await page.goto(`/?${search}`);
  if (waitForCards) {
    await expect(page.getByRole('article').first()).toBeVisible();
  }
}

export const card = (page, company) =>
  page.getByRole('article').filter({
    has: page.getByRole('heading', { name: company }),
  });

export const dialog = (page, name) => page.getByRole('dialog', { name });

export const snackbar = (page, text) =>
  page.getByRole('alert').filter({ hasText: text });

// Operations the app sent to the mock API since the page loaded.
export const operations = page =>
  page.evaluate(() => window.__mockApi.operations);

export const operationsNamed = async (page, name) =>
  (await operations(page)).filter(op => op.operationName === name);

// Waits for transitions (dialog fades, menus) to finish. Endless animations
// such as skeleton pulses are ignored.
export const settle = page =>
  page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        a =>
          a.playState !== 'running' ||
          a.effect?.getComputedTiming().iterations === Infinity
      )
  );

// Fails on serious or critical WCAG 2.1 A/AA violations.
export async function expectAccessible(page) {
  await settle(page);
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = violations
    .filter(v => ['serious', 'critical'].includes(v.impact))
    .map(
      v =>
        `${v.id}: ${v.help} → ${v.nodes.map(n => n.target.join(' ')).join(', ')}`
    );
  expect(blocking).toEqual([]);
}
