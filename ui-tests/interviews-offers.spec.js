import {
  card,
  dialog,
  expect,
  openApp,
  operationsNamed,
  settle,
  snackbar,
  test,
} from './fixtures';

// Opens Stripe's application on the given tab. Stripe has two interviews
// (Riley Chen on Jun 11, Morgan Diaz on Jun 16) and an offer.
async function openStripe(page, tab, params) {
  await openApp(page, params);
  await card(page, 'Stripe')
    .getByRole('button', { name: 'Edit Stripe' })
    .click();
  const job = dialog(page, 'Stripe');
  await job.getByRole('tab', { name: tab }).click();
  return job;
}

const updates = page => operationsNamed(page, 'UpdateInterview');

test.describe('interviews', () => {
  test('lists the application interviews with a count on the tab', async ({
    page,
  }) => {
    const job = await openStripe(page, /Interviews/);
    await expect(job.getByRole('tab', { name: /Interviews/ })).toHaveText(
      'Interviews 2'
    );
    await expect(job.getByLabel('Interviewer')).toHaveCount(2);
    await expect(job.getByLabel('Interviewer').first()).toHaveValue(
      'Riley Chen'
    );
    await expect(job).toContainText('Changes save automatically');
  });

  test('status saves as soon as it changes', async ({ page }) => {
    const job = await openStripe(page, /Interviews/);
    await job.getByRole('combobox', { name: 'Status' }).first().click();
    await page.getByRole('option', { name: 'Pending' }).click();

    await expect(snackbar(page, 'Interview saved')).toBeVisible();
    const sent = await updates(page);
    expect(sent).toHaveLength(1);
    expect(sent[0].variables.interview).toMatchObject({
      interviewer: 'Riley Chen',
      status: 'pending',
    });
  });

  test('a date picked from the calendar saves once', async ({ page }) => {
    const job = await openStripe(page, /Interviews/);
    await job
      .getByRole('group', { name: 'Interview date' })
      .first()
      .getByRole('button', { name: /Choose date/ })
      .click();
    // Pick once the calendar has finished opening, as a person would; a
    // click mid-animation is dropped.
    const calendar = page.getByRole('dialog').filter({
      has: page.getByRole('grid'),
    });
    await expect(calendar).toBeVisible();
    await settle(page);
    await calendar.getByRole('gridcell', { name: '20' }).click();
    await expect(calendar).toBeHidden();

    await expect(snackbar(page, 'Interview saved')).toBeVisible();
    const sent = await updates(page);
    expect(sent).toHaveLength(1);
    expect(sent[0].variables.interview.interviewDate).toBe('2026-06-20');
  });

  test('a typed date saves once, when the field loses focus', async ({
    page,
  }) => {
    const job = await openStripe(page, /Interviews/);
    const date = job.getByRole('group', { name: 'Interview date' }).first();
    await date.getByRole('spinbutton', { name: 'Month' }).click();
    await page.keyboard.type('06252026');
    expect(await updates(page)).toHaveLength(0);

    await job.getByRole('heading', { name: 'Stripe' }).click();
    await expect(snackbar(page, 'Interview saved')).toBeVisible();
    const sent = await updates(page);
    expect(sent).toHaveLength(1);
    expect(sent[0].variables.interview.interviewDate).toBe('2026-06-25');
  });

  test('text fields save on blur, and only when changed', async ({ page }) => {
    const job = await openStripe(page, /Interviews/);
    const interviewer = job.getByLabel('Interviewer').nth(1);
    const description = job.getByLabel('Description').nth(1);

    // Visiting fields without changing them sends nothing.
    await interviewer.click();
    await description.click();
    await job.getByRole('heading', { name: 'Stripe' }).click();
    expect(await updates(page)).toHaveLength(0);

    await interviewer.fill('Morgan Díaz');
    await job.getByRole('heading', { name: 'Stripe' }).click();
    await expect(snackbar(page, 'Interview saved')).toBeVisible();
    const sent = await updates(page);
    expect(sent).toHaveLength(1);
    expect(sent[0].variables.interview.interviewer).toBe('Morgan Díaz');
    await expect(job).toContainText('· Morgan Díaz');
  });

  test('adds an interview dated today', async ({ page }) => {
    const job = await openStripe(page, /Interviews/);
    await job.getByRole('button', { name: 'Add interview' }).click();

    await expect(snackbar(page, 'Interview added')).toBeVisible();
    await expect(job.getByLabel('Interviewer')).toHaveCount(3);
    await expect(job).toContainText('Jun 15, 2026');
    await expect(job.getByRole('tab', { name: /Interviews/ })).toHaveText(
      'Interviews 3'
    );
  });

  test('deletes an interview after confirming', async ({ page }) => {
    const job = await openStripe(page, /Interviews/);
    await job.getByRole('button', { name: 'Delete' }).first().click();
    await page
      .getByRole('dialog', { name: 'Confirm deletion' })
      .getByRole('button', { name: 'Delete' })
      .click();

    await expect(snackbar(page, 'Interview deleted')).toBeVisible();
    await expect(job.getByLabel('Interviewer')).toHaveCount(1);
    await expect(job.getByLabel('Interviewer')).toHaveValue('Morgan Diaz');
  });

  test('a failed delete keeps the interview', async ({ page }) => {
    const job = await openStripe(page, /Interviews/, {
      'mock-fail': 'DeleteInterview',
    });
    await job.getByRole('button', { name: 'Delete' }).first().click();
    await page
      .getByRole('dialog', { name: 'Confirm deletion' })
      .getByRole('button', { name: 'Delete' })
      .click();

    await expect(snackbar(page, 'Error deleting interview.')).toBeVisible();
    await expect(job.getByLabel('Interviewer')).toHaveCount(2);
  });

  test('Interview list shows upcoming open interviews', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'Interview list' }).click();
    const list = dialog(page, 'Interview list');
    // Past and expired interviews are left out: 6 of 12.
    await expect(list.getByRole('row')).toHaveCount(7);
    await expect(list).toContainText('Morgan Diaz');
    await expect(list).not.toContainText('Riley Chen');

    await list
      .getByRole('row', { name: /Morgan Diaz/ })
      .getByRole('button', { name: 'Job details' })
      .click();
    await expect(dialog(page, 'Stripe')).toBeVisible();
  });
});

test.describe('offers', () => {
  test('updates an existing offer', async ({ page }) => {
    const job = await openStripe(page, 'Offer');
    const salary = job.getByLabel('Salary offered');
    await expect(salary).toHaveValue('215k + equity');
    await salary.fill('225k + equity');
    await job.getByRole('button', { name: 'Save offer' }).click();

    await expect(snackbar(page, 'Offer updated')).toBeVisible();
    await expect(job).toBeHidden();
    await card(page, 'Stripe')
      .getByRole('button', { name: 'Edit Stripe' })
      .click();
    await dialog(page, 'Stripe').getByRole('tab', { name: 'Offer' }).click();
    await expect(
      dialog(page, 'Stripe').getByLabel('Salary offered')
    ).toHaveValue('225k + equity');
  });

  test('adds an offer, which then shows in the Offer list', async ({
    page,
  }) => {
    await openApp(page);
    await card(page, 'Anthropic')
      .getByRole('button', { name: 'Edit Anthropic' })
      .click();
    const job = dialog(page, 'Anthropic');
    await job.getByRole('tab', { name: 'Offer' }).click();
    await expect(
      job.getByRole('button', { name: 'Save offer' })
    ).toBeDisabled();

    await job.getByRole('button', { name: 'Add offer' }).click();
    await job.getByRole('button', { name: 'Save offer' }).click();
    await expect(job).toContainText('Salary offered is required.');

    await job.getByLabel('Salary offered').fill('250k + equity');
    await job.getByLabel('Description').fill('Verbal offer');
    await job.getByRole('button', { name: 'Save offer' }).click();
    await expect(snackbar(page, 'Offer added')).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Offer list' })
    ).toContainText('4');
    await page.getByRole('button', { name: 'Offer list' }).click();
    await expect(dialog(page, 'Offer list')).toContainText('250k + equity');
  });

  test('deletes a saved offer after confirming', async ({ page }) => {
    const job = await openStripe(page, 'Offer');
    await job.getByRole('button', { name: 'Delete' }).click();
    await page
      .getByRole('dialog', { name: 'Confirm deletion' })
      .getByRole('button', { name: 'Delete' })
      .click();

    await expect(snackbar(page, 'Offer deleted')).toBeVisible();
    await expect(job.getByRole('button', { name: 'Add offer' })).toBeVisible();
    await expect(job.getByLabel('Salary offered')).toHaveCount(0);
  });

  test('no "Add offer" until the saved offer has loaded', async ({ page }) => {
    const job = await openStripe(page, 'Offer', { 'mock-delay': '1500' });
    await expect(job.getByText('Loading...')).toBeVisible();
    await expect(job.getByRole('button', { name: 'Add offer' })).toHaveCount(0);
    await expect(job.getByLabel('Salary offered')).toHaveValue('215k + equity');
    await expect(job.getByRole('button', { name: 'Add offer' })).toHaveCount(0);
  });

  test('Offer list sorts by column', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'Offer list' }).click();
    const list = dialog(page, 'Offer list');
    await expect(list.getByRole('row')).toHaveCount(4);

    await list.getByRole('button', { name: 'Salary offered' }).click();
    await expect(list.getByRole('row').nth(1)).toContainText('195k + bonus');
    await list.getByRole('button', { name: 'Salary offered' }).click();
    await expect(list.getByRole('row').nth(1)).toContainText('215k + equity');
  });
});
