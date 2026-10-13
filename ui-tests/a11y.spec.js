import {
  card,
  dialog,
  expect,
  expectAccessible,
  openApp,
  test,
} from './fixtures';

// No serious or critical WCAG 2.1 A/AA violations on any main view, in
// light and dark.
for (const colorScheme of ['light', 'dark']) {
  test.describe(`accessibility (${colorScheme})`, () => {
    test.use({ colorScheme });

    test('board', async ({ page }) => {
      await openApp(page);
      await expectAccessible(page);
    });

    test('filtered board and no-match state', async ({ page }) => {
      await openApp(page);
      await page.getByRole('button', { name: /^Active/ }).click();
      await expectAccessible(page);
      await page.getByRole('textbox', { name: 'search' }).fill('zzz');
      await expect(page.getByRole('status')).toBeVisible();
      await expectAccessible(page);
    });

    test('empty, loading and error states', async ({ page }) => {
      await openApp(page, { 'mock-data': 'empty' }, { waitForCards: false });
      await expect(page.getByRole('status')).toBeVisible();
      await expectAccessible(page);

      await openApp(page, { 'mock-delay': '60000' }, { waitForCards: false });
      await expect(page.getByTestId('loading-card').first()).toBeVisible();
      await expectAccessible(page);

      await openApp(
        page,
        { 'mock-fail': 'GetJobApplications' },
        { waitForCards: false }
      );
      await expect(page.getByRole('alert')).toBeVisible();
      await expectAccessible(page);
    });

    test('job dialog tabs', async ({ page }) => {
      await openApp(page);
      await card(page, 'Stripe')
        .getByRole('button', { name: 'Edit Stripe' })
        .click();
      const job = dialog(page, 'Stripe');
      await expect(job.getByLabel('Company name')).toHaveValue('Stripe');
      await expectAccessible(page);
      await job.getByRole('tab', { name: /Interviews/ }).click();
      await expect(job.getByText('Changes save automatically')).toBeVisible();
      await expectAccessible(page);
      await job.getByRole('tab', { name: 'Offer' }).click();
      await expect(job.getByLabel('Salary offered')).toBeVisible();
      await expectAccessible(page);
    });

    test('new application dialog', async ({ page }) => {
      await openApp(page);
      await page.getByRole('button', { name: 'New application' }).click();
      await expect(dialog(page, 'New application')).toBeVisible();
      await expectAccessible(page);
    });

    for (const [button, title, ready] of [
      ['Bookmarks', 'Bookmarks', 'LinkedIn Jobs'],
      ['Q&A', 'Q&A', 'Why are you interested'],
      ['Interview list', 'Interview list', 'Morgan Diaz'],
      ['Offer list', 'Offer list', '215k + equity'],
    ]) {
      test(`${title} dialog`, async ({ page }) => {
        await openApp(page);
        await page.getByRole('button', { name: button, exact: true }).click();
        await expect(dialog(page, title)).toContainText(ready);
        await expectAccessible(page);
      });
    }

    test('profile dialog and account menu', async ({ page }) => {
      await openApp(page);
      await page.getByRole('button', { name: 'Account menu' }).click();
      await expect(page.getByRole('menu')).toBeVisible();
      await expectAccessible(page);
      await page.getByRole('menuitem', { name: 'Profile' }).click();
      await expect(
        dialog(page, 'Profile').getByLabel('First name')
      ).not.toHaveValue('');
      await expectAccessible(page);
    });

    test('delete confirmation', async ({ page }) => {
      await openApp(page);
      await card(page, 'Snap')
        .getByRole('button', { name: 'Delete Snap' })
        .click();
      await expect(dialog(page, 'Delete Snap?')).toBeVisible();
      await expectAccessible(page);
    });

    test('mobile board and menu', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await openApp(page);
      await expectAccessible(page);
      await page.getByRole('button', { name: 'More actions' }).click();
      await expect(page.getByRole('menu')).toBeVisible();
      await expectAccessible(page);
    });
  });
}
