import {
  card,
  dialog,
  expect,
  openApp,
  operationsNamed,
  snackbar,
  test,
} from './fixtures';

test.describe('header', () => {
  test('badges count upcoming interviews and offers', async ({ page }) => {
    await openApp(page);
    await expect(
      page.getByRole('button', { name: 'Interview list' })
    ).toContainText('6');
    await expect(
      page.getByRole('button', { name: 'Offer list' })
    ).toContainText('3');
  });

  test('switches to dark mode and remembers it', async ({ page }) => {
    await openApp(page);
    const html = page.locator('html');
    await expect(html).toHaveClass(/light/);
    await page.getByRole('button', { name: 'Dark mode' }).click();
    await expect(html).toHaveClass(/dark/);
    await expect(
      page.getByRole('button', { name: 'Light mode' })
    ).toBeVisible();

    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });

  test('switches the language to Spanish', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitemradio', { name: 'Español' }).click();

    await expect(
      page.getByRole('button', { name: 'Nueva solicitud' })
    ).toBeVisible();
    await expect(
      page.getByRole('group', { name: 'Filtrar por estado' })
    ).toContainText('Todos');

    await page.getByRole('button', { name: 'Menú de cuenta' }).click();
    await expect(
      page.getByRole('menuitemradio', { name: 'Español' })
    ).toHaveAttribute('aria-checked', 'true');
  });

  test('edits and saves the profile', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    const profile = dialog(page, 'Profile');
    const city = profile.getByLabel('City');
    await expect(city).toHaveValue('City');

    await city.fill('Springfield');
    await profile.getByRole('button', { name: 'Save profile' }).click();
    await expect(snackbar(page, 'Profile saved')).toBeVisible();
    const [sent] = await operationsNamed(page, 'UpdateProfile');
    expect(sent.variables).toMatchObject({ addressCity: 'Springfield' });
  });

  test('profile fields have copy buttons', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openApp(page);
    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    const profile = dialog(page, 'Profile');
    await expect(profile.getByLabel('Email')).toHaveValue('test@test.com');

    const copy = profile.getByRole('button', { name: /Copy/ }).first();
    await copy.click();
    await expect(
      profile.getByRole('button', { name: /Copied/ }).first()
    ).toBeVisible();
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('"+" button opens a full-screen new application', async ({ page }) => {
    await openApp(page);
    await expect(
      page.getByRole('button', { name: 'New application' })
    ).toHaveCount(1);
    await page.getByRole('button', { name: 'New application' }).click();
    const form = dialog(page, 'New application');
    await expect(form).toBeVisible();
    const box = await form.boundingBox();
    expect(box.width).toBe(390);
  });

  test('menu reaches every header action', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'More actions' }).click();
    const menu = page.getByRole('menu');
    for (const item of [
      'Bookmarks',
      'Q&A',
      'Interview list',
      'Offer list',
      'Dark mode',
      'Profile',
    ]) {
      await expect(menu.getByRole('menuitem', { name: item })).toBeVisible();
    }
    await menu.getByRole('menuitem', { name: 'Bookmarks' }).click();
    await expect(dialog(page, 'Bookmarks')).toBeVisible();
  });

  test('search expands from the icon and filters', async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'search' }).click();
    const input = page.getByRole('textbox', { name: 'search' });
    await expect(input).toBeFocused();
    await input.fill('Stripe');
    await expect(page.getByRole('article')).toHaveCount(1);
    await expect(card(page, 'Stripe')).toBeVisible();
  });

  test('status chips scroll sideways without widening the page', async ({
    page,
  }) => {
    await openApp(page);
    const rejected = page.getByRole('button', { name: /^Rejected/ });
    await rejected.click();
    await expect(rejected).toBeInViewport();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
