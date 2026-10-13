import {
  card,
  dialog,
  expect,
  openApp,
  operationsNamed,
  snackbar,
  test,
} from './fixtures';

test.describe('job applications', () => {
  test('lists most actionable first, newest first within a status', async ({
    page,
  }) => {
    await openApp(page);
    const headings = page.getByRole('article').getByRole('heading');
    await expect(headings).toHaveCount(20);
    // Active (Coinbase is the newest active), then open, ghosted, rejected
    // (Netflix is the oldest rejected).
    await expect(headings.first()).toContainText('Coinbase');
    await expect(headings.nth(6)).toContainText('Linear');
    await expect(headings.last()).toContainText('Netflix');
  });

  test('card shows status, date, salary and links to the posting', async ({
    page,
  }) => {
    await openApp(page);
    const stripe = card(page, 'Stripe');
    await expect(stripe).toContainText('Active');
    await expect(stripe).toContainText('API Engineer');
    await expect(stripe).toContainText('Applied Jun 5, 2026');
    const link = stripe.getByRole('link', {
      name: 'Stripe: open job posting in a new tab',
    });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('href', /^https?:\/\//);
  });

  test('creates an application', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'New application' }).click();
    const form = dialog(page, 'New application');
    await expect(form).toBeVisible();
    // New applications have no status field or tabs.
    await expect(form.getByRole('tab')).toHaveCount(0);

    await form.getByLabel('Company Name').fill('Acme Robotics');
    await form.getByLabel('Job Title').fill('Frontend Engineer');
    await form.getByLabel('Salary Range').fill('150k-180k');
    await form.getByLabel('Description').fill('Robot fleet dashboards');
    await form.getByRole('button', { name: 'Save application' }).click();

    await expect(snackbar(page, 'Job application saved')).toBeVisible();
    await expect(form).toBeHidden();
    const acme = card(page, 'Acme Robotics');
    await expect(acme).toContainText('Open');
    await expect(acme).toContainText('Applied Jun 15, 2026');
    await expect(page.getByRole('button', { name: /^All/ })).toContainText(
      '21'
    );
  });

  test('requires company, title and salary', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'New application' }).click();
    const form = dialog(page, 'New application');
    await form.getByRole('button', { name: 'Save application' }).click();

    await expect(form).toContainText('Company Name is required.');
    await expect(form).toContainText('Job Title is required.');
    await expect(form).toContainText('Salary Range is required.');
    expect(await operationsNamed(page, 'AddJobApplication')).toHaveLength(0);
  });

  test('edits an application, including its status', async ({ page }) => {
    await openApp(page);
    await card(page, 'Anthropic')
      .getByRole('button', { name: 'Edit Anthropic' })
      .click();
    const form = dialog(page, 'Anthropic');
    await expect(form.getByLabel('Company Name')).toHaveValue('Anthropic');

    await form.getByLabel('Job Title').fill('Member of Technical Staff');
    await form.getByRole('combobox', { name: 'Status' }).click();
    await page.getByRole('option', { name: 'Active' }).click();
    await form.getByRole('button', { name: 'Save application' }).click();

    await expect(snackbar(page, 'Job application saved')).toBeVisible();
    const anthropic = card(page, 'Anthropic');
    await expect(anthropic).toContainText('Member of Technical Staff');
    await expect(anthropic).toContainText('Active');
  });

  test('keeps the dialog open with the typed values when a save fails', async ({
    page,
  }) => {
    await openApp(page, { 'mock-fail': 'UpdateJobApplication' });
    await card(page, 'Figma')
      .getByRole('button', { name: 'Edit Figma' })
      .click();
    const form = dialog(page, 'Figma');
    await form.getByLabel('Job Title').fill('Infrastructure Engineer');
    await form.getByRole('button', { name: 'Save application' }).click();

    await expect(
      snackbar(page, 'Failed to save the job application.')
    ).toBeVisible();
    await expect(form).toBeVisible();
    await expect(form.getByLabel('Job Title')).toHaveValue(
      'Infrastructure Engineer'
    );
  });

  test('cancel discards edits', async ({ page }) => {
    await openApp(page);
    await card(page, 'Notion')
      .getByRole('button', { name: 'Edit Notion' })
      .click();
    const form = dialog(page, 'Notion');
    await form.getByLabel('Job Title').fill('Changed');
    await form.getByRole('button', { name: 'Cancel' }).click();

    await expect(form).toBeHidden();
    await expect(card(page, 'Notion')).toContainText('Fullstack Engineer');
    expect(await operationsNamed(page, 'UpdateJobApplication')).toHaveLength(0);
  });

  test('deletes an application after confirming', async ({ page }) => {
    await openApp(page);
    await card(page, 'Snap')
      .getByRole('button', { name: 'Delete Snap' })
      .click();
    const confirm = dialog(page, 'Delete Snap?');
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: 'Delete' }).click();

    await expect(snackbar(page, 'Job application deleted')).toBeVisible();
    await expect(card(page, 'Snap')).toHaveCount(0);
    await expect(page.getByRole('article')).toHaveCount(19);
  });

  test('cancelling the confirmation keeps the application', async ({
    page,
  }) => {
    await openApp(page);
    await card(page, 'Snap')
      .getByRole('button', { name: 'Delete Snap' })
      .click();
    await dialog(page, 'Delete Snap?')
      .getByRole('button', { name: 'Cancel' })
      .click();

    await expect(card(page, 'Snap')).toBeVisible();
    expect(await operationsNamed(page, 'DeleteJobApplication')).toHaveLength(0);
  });

  test('a failed delete keeps the card and reports the error', async ({
    page,
  }) => {
    await openApp(page, { 'mock-fail': 'DeleteJobApplication' });
    await card(page, 'Snap')
      .getByRole('button', { name: 'Delete Snap' })
      .click();
    await dialog(page, 'Delete Snap?')
      .getByRole('button', { name: 'Delete' })
      .click();

    await expect(
      snackbar(page, 'Failed to delete the job application.')
    ).toBeVisible();
    await expect(card(page, 'Snap')).toBeVisible();
  });
});
