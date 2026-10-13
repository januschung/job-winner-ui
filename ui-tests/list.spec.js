import { card, expect, openApp, test } from './fixtures';

const chip = (page, name) =>
  page
    .getByRole('group', { name: 'Filter by status' })
    .getByRole('button', { name: new RegExp(`^${name}`) });

const search = page => page.getByRole('textbox', { name: 'search' });

test.describe('status filter', () => {
  test('chips show a count per status', async ({ page }) => {
    await openApp(page);
    await expect(chip(page, 'All')).toHaveText('All 20');
    await expect(chip(page, 'Open')).toHaveText('Open 9');
    await expect(chip(page, 'Active')).toHaveText('Active 6');
    await expect(chip(page, 'Ghosted')).toHaveText('Ghosted 3');
    await expect(chip(page, 'Rejected')).toHaveText('Rejected 2');
    await expect(chip(page, 'All')).toHaveAttribute('aria-pressed', 'true');
  });

  test('filters by status and clears back to all', async ({ page }) => {
    await openApp(page);
    await chip(page, 'Ghosted').click();

    await expect(chip(page, 'Ghosted')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('article')).toHaveCount(3);
    await expect(card(page, 'Lyft')).toBeVisible();

    await page.getByRole('button', { name: 'Clear status filter' }).click();
    await expect(page.getByRole('article')).toHaveCount(20);
    await expect(chip(page, 'All')).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.getByRole('button', { name: 'Clear status filter' })
    ).toBeHidden();
  });

  test('disables statuses with no applications', async ({ page }) => {
    await openApp(page);
    for (const company of ['Netflix', 'Uber']) {
      await card(page, company)
        .getByRole('button', { name: `Delete ${company}` })
        .click();
      await page
        .getByRole('dialog', { name: `Delete ${company}?` })
        .getByRole('button', { name: 'Delete' })
        .click();
      await expect(card(page, company)).toHaveCount(0);
    }
    await expect(chip(page, 'Rejected')).toHaveText('Rejected 0');
    await expect(chip(page, 'Rejected')).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
});

test.describe('search', () => {
  test('matches company, title and description', async ({ page }) => {
    await openApp(page);
    await search(page).fill('backend');
    // "Backend Engineer" titles plus descriptions that mention backend.
    const companies = page.getByRole('article').getByRole('heading');
    await expect(companies.first()).toBeVisible();
    for (const company of await companies.allTextContents()) {
      const text = await card(page, company).textContent();
      expect(text.toLowerCase()).toContain('backend');
    }

    await search(page).fill('Stripe');
    await expect(page.getByRole('article')).toHaveCount(1);
    await expect(card(page, 'Stripe')).toBeVisible();
  });

  test('searching resets the status filter', async ({ page }) => {
    await openApp(page);
    await chip(page, 'Rejected').click();
    await search(page).fill('Stripe');
    await expect(chip(page, 'All')).toHaveAttribute('aria-pressed', 'true');
    await expect(card(page, 'Stripe')).toBeVisible();
  });

  test('no results offers to clear the search', async ({ page }) => {
    await openApp(page);
    await search(page).fill('zzz');

    const empty = page.getByRole('status');
    await expect(empty).toContainText('No results for “zzz”');
    await expect(empty).toContainText('Try a different company');
    await empty.getByRole('button', { name: 'Clear search' }).click();

    await expect(search(page)).toHaveValue('');
    await expect(page.getByRole('article')).toHaveCount(20);
  });

  test('no matches within a status offers both ways out', async ({ page }) => {
    await openApp(page);
    await search(page).fill('Stripe');
    await chip(page, 'Open').click();

    const empty = page.getByRole('status');
    await expect(empty).toContainText(
      'Nothing matches your search in Open applications.'
    );
    await expect(
      empty.getByRole('button', { name: 'Clear search' })
    ).toBeVisible();
    await empty.getByRole('button', { name: 'Show all statuses' }).click();
    await expect(card(page, 'Stripe')).toBeVisible();
  });

  test('"/" focuses search unless typing in a field', async ({ page }) => {
    await openApp(page);
    await page.keyboard.press('/');
    await expect(search(page)).toBeFocused();
    await page.keyboard.type('Snap');
    await expect(page.getByRole('article')).toHaveCount(1);

    // Inside a form field "/" is just a character.
    await page.getByRole('button', { name: 'New application' }).click();
    const company = page.getByLabel('Company Name');
    await company.click();
    await page.keyboard.type('A/B');
    await expect(company).toHaveValue('A/B');
  });
});

test.describe('page states', () => {
  test('shows a skeleton while loading', async ({ page }) => {
    await openApp(page, { 'mock-delay': '60000' }, { waitForCards: false });
    const loading = page.getByRole('status').and(page.locator('[aria-busy]'));
    await expect(loading).toBeVisible();
    await expect(page.getByTestId('loading-card')).toHaveCount(3);
    await expect(page.getByRole('article')).toHaveCount(0);
  });

  test('empty board invites the first application', async ({ page }) => {
    await openApp(page, { 'mock-data': 'empty' }, { waitForCards: false });
    const empty = page.getByRole('status');
    await expect(empty).toContainText('Track your first application');
    await expect(
      page.getByRole('group', { name: 'Filter by status' })
    ).toBeHidden();

    await empty.getByRole('button', { name: 'New application' }).click();
    const form = page.getByRole('dialog', { name: 'New application' });
    await form.getByLabel('Company Name').fill('Acme');
    await form.getByLabel('Job Title').fill('Engineer');
    await form.getByLabel('Salary Range').fill('100k');
    await form.getByRole('button', { name: 'Save application' }).click();

    await expect(card(page, 'Acme')).toBeVisible();
    await expect(chip(page, 'All')).toHaveText('All 1');
  });

  test('a failed load shows an error with Retry', async ({ page }) => {
    await openApp(
      page,
      { 'mock-fail': 'GetJobApplications' },
      { waitForCards: false }
    );
    const alert = page.getByRole('alert').filter({
      hasText: "Couldn't load applications.",
    });
    await expect(alert).toBeVisible();

    await expect(page.getByRole('article')).toHaveCount(0);

    // The backend recovers; Retry loads the board.
    await page.evaluate(() => window.__mockApi.fail.clear());
    await alert.getByRole('button', { name: 'Retry' }).click();
    await expect(page.getByRole('article')).toHaveCount(20);
    await expect(alert).toBeHidden();
  });
});
