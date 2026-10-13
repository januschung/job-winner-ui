import { card, dialog, expect, openApp, settle, test } from './fixtures';

// Screenshot baselines for the key views, light and dark. Baselines live in
// ui-tests/__screenshots__ and are only valid from the Playwright Linux image:
// update them with `npm run test:ui:visual -- --update-snapshots`.

async function snap(page, name) {
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
  await expect(page).toHaveScreenshot(`${name}.png`);
}

async function openJob(page, company, tab) {
  await openApp(page, { 'mock-delay': '0' });
  await card(page, company)
    .getByRole('button', { name: `Edit ${company}` })
    .click();
  const job = dialog(page, company);
  if (tab) await job.getByRole('tab', { name: tab }).click();
  return job;
}

const desktopViews = {
  board: async page => {
    await openApp(page, { 'mock-delay': '0' });
  },
  'board-no-matches': async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('textbox', { name: 'search' }).fill('stripe');
    await page.getByRole('button', { name: /^Ghosted/ }).click();
    await expect(page.getByRole('status')).toBeVisible();
  },
  'board-empty': async page => {
    await openApp(page, { 'mock-data': 'empty' }, { waitForCards: false });
    await expect(page.getByRole('status')).toBeVisible();
  },
  'board-error': async page => {
    await openApp(
      page,
      { 'mock-fail': 'GetJobApplications' },
      { waitForCards: false }
    );
    await expect(page.getByRole('alert')).toBeVisible();
  },
  'board-loading': async page => {
    await openApp(page, { 'mock-delay': '60000' }, { waitForCards: false });
    await expect(page.getByTestId('loading-card').first()).toBeVisible();
  },
  'job-application': async page => {
    const job = await openJob(page, 'Stripe');
    await expect(job.getByLabel('Company name')).toHaveValue('Stripe');
  },
  'job-interviews': async page => {
    const job = await openJob(page, 'Stripe', /Interviews/);
    await expect(job.getByLabel('Interviewer')).toHaveCount(2);
  },
  'job-offer': async page => {
    const job = await openJob(page, 'Stripe', 'Offer');
    await expect(job.getByLabel('Salary offered')).toHaveValue(/215k/);
  },
  'new-application': async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('button', { name: 'New application' }).click();
    await expect(dialog(page, 'New application')).toBeVisible();
  },
  bookmarks: async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('button', { name: 'Bookmarks' }).click();
    await expect(dialog(page, 'Bookmarks')).toContainText('LinkedIn Jobs');
  },
  qa: async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('button', { name: 'Q&A' }).click();
    await dialog(page, 'Q&A')
      .getByRole('button', {
        name: 'Why are you interested in this role?',
        exact: true,
      })
      .click();
  },
  'interview-list': async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('button', { name: 'Interview list' }).click();
    await expect(dialog(page, 'Interview list').getByRole('row')).toHaveCount(
      7
    );
  },
  profile: async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(dialog(page, 'Profile').getByLabel('City')).toHaveValue(
      'City'
    );
  },
  'confirm-delete': async page => {
    await openApp(page, { 'mock-delay': '0' });
    await card(page, 'Snap')
      .getByRole('button', { name: 'Delete Snap' })
      .click();
    await expect(dialog(page, 'Delete Snap?')).toBeVisible();
  },
};

const mobileViews = {
  'mobile-board': async page => {
    await openApp(page, { 'mock-delay': '0' });
  },
  'mobile-menu': async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('button', { name: 'More actions' }).click();
    await expect(page.getByRole('menu')).toBeVisible();
  },
  'mobile-job-interviews': async page => {
    const job = await openJob(page, 'Stripe', /Interviews/);
    await expect(job.getByLabel('Interviewer')).toHaveCount(2);
  },
};

for (const colorScheme of ['light', 'dark']) {
  test.describe(colorScheme, () => {
    test.use({ colorScheme, viewport: { width: 1280, height: 800 } });
    for (const [name, show] of Object.entries(desktopViews)) {
      test(name, async ({ page }) => {
        await show(page);
        await snap(page, `${name}-${colorScheme}`);
      });
    }
  });

  test.describe(`${colorScheme} mobile`, () => {
    test.use({
      colorScheme,
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    for (const [name, show] of Object.entries(mobileViews)) {
      test(name, async ({ page }) => {
        await show(page);
        await snap(page, `${name}-${colorScheme}`);
      });
    }
  });
}
