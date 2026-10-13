import { dialog, expect, openApp, snackbar, test } from './fixtures';

test.describe('bookmarks', () => {
  test.beforeEach(async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'Bookmarks' }).click();
    await expect(
      dialog(page, 'Bookmarks').getByRole('link', { name: 'LinkedIn Jobs' })
    ).toBeVisible();
  });

  test('lists bookmarks as links that open in a new tab', async ({ page }) => {
    const links = dialog(page, 'Bookmarks').getByRole('link');
    await expect(links).toHaveCount(20);
    await expect(links.first()).toHaveAttribute('target', '_blank');
  });

  test('adds, edits and deletes a bookmark', async ({ page }) => {
    const list = dialog(page, 'Bookmarks');
    await list.getByRole('button', { name: 'Add', exact: true }).click();
    const add = dialog(page, 'Add Bookmark');
    await add.getByLabel('Title').fill('Hacker News Jobs');
    await add.getByLabel('URL').fill('https://news.ycombinator.com/jobs');
    await add.getByRole('button', { name: 'Save bookmark' }).click();
    await expect(snackbar(page, 'Bookmark saved')).toBeVisible();
    await expect(
      list.getByRole('link', { name: 'Hacker News Jobs' })
    ).toHaveAttribute('href', 'https://news.ycombinator.com/jobs');

    await list.getByRole('button', { name: 'Edit Hacker News Jobs' }).click();
    const edit = dialog(page, 'Edit Bookmark');
    await expect(edit.getByLabel('Title')).toHaveValue('Hacker News Jobs');
    await edit.getByLabel('Title').fill('HN Jobs');
    await edit.getByRole('button', { name: 'Save bookmark' }).click();
    await expect(list.getByRole('link', { name: 'HN Jobs' })).toBeVisible();

    await list.getByRole('button', { name: 'Delete HN Jobs' }).click();
    await dialog(page, 'Delete HN Jobs?')
      .getByRole('button', { name: 'Delete' })
      .click();
    await expect(snackbar(page, 'Bookmark deleted')).toBeVisible();
    await expect(list.getByRole('link', { name: 'HN Jobs' })).toHaveCount(0);
  });

  test('"Add" starts blank after editing another bookmark', async ({
    page,
  }) => {
    const list = dialog(page, 'Bookmarks');
    await list.getByRole('button', { name: 'Edit Indeed' }).click();
    const edit = dialog(page, 'Edit Bookmark');
    await expect(edit.getByLabel('Title')).toHaveValue('Indeed');
    await edit.getByRole('button', { name: 'Cancel' }).click();

    await list.getByRole('button', { name: 'Add', exact: true }).click();
    const add = dialog(page, 'Add Bookmark');
    await expect(add.getByLabel('Title')).toHaveValue('');
    await expect(add.getByLabel('URL')).toHaveValue('');
  });

  test('requires a title and URL', async ({ page }) => {
    await dialog(page, 'Bookmarks')
      .getByRole('button', { name: 'Add', exact: true })
      .click();
    const add = dialog(page, 'Add Bookmark');
    await add.getByRole('button', { name: 'Save bookmark' }).click();
    await expect(add).toContainText('Title is required.');
    await expect(add).toContainText('URL is required.');
  });
});

test.describe('Q&A', () => {
  test.beforeEach(async ({ page }) => {
    await openApp(page);
    await page.getByRole('button', { name: 'Q&A' }).click();
    await expect(dialog(page, 'Q&A')).toContainText('Why are you interested');
  });

  test('expands a question to show its answer', async ({ page }) => {
    const qa = dialog(page, 'Q&A');
    const question = qa.getByRole('button', {
      name: 'Why are you interested in this role?',
      exact: true,
    });
    await expect(question).toHaveAttribute('aria-expanded', 'false');
    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'true');
  });

  test('adds, edits and deletes a Q&A', async ({ page }) => {
    const qa = dialog(page, 'Q&A');
    await qa.getByRole('button', { name: 'Add', exact: true }).click();
    const add = dialog(page, 'Add Q&A');
    await add.getByLabel('Question').fill('What is your notice period?');
    await add.getByLabel('Answer').fill('Two weeks.');
    await add.getByRole('button', { name: 'Save Q&A' }).click();
    await expect(snackbar(page, 'Q&A updated')).toBeVisible();
    await expect(qa).toContainText('What is your notice period?');

    await qa
      .getByRole('button', { name: 'Edit What is your notice period?' })
      .click();
    const edit = dialog(page, 'Edit Q&A');
    await edit.getByLabel('Answer').fill('Three weeks.');
    await edit.getByRole('button', { name: 'Save Q&A' }).click();
    await expect(edit).toBeHidden();
    await qa
      .getByRole('button', { name: 'What is your notice period?', exact: true })
      .click();
    await expect(qa).toContainText('Three weeks.');

    await qa
      .getByRole('button', { name: 'Delete What is your notice period?' })
      .click();
    await page
      .getByRole('dialog', { name: 'Confirm Deletion' })
      .getByRole('button', { name: 'Delete' })
      .click();
    await expect(snackbar(page, 'Question deleted')).toBeVisible();
    await expect(qa).not.toContainText('What is your notice period?');
  });

  test('editing does not toggle the accordion', async ({ page }) => {
    const qa = dialog(page, 'Q&A');
    const question = qa.getByRole('button', {
      name: 'Why are you interested in this role?',
      exact: true,
    });
    await qa
      .getByRole('button', {
        name: 'Edit Why are you interested in this role?',
      })
      .click();
    await dialog(page, 'Edit Q&A')
      .getByRole('button', { name: 'Cancel' })
      .click();
    await expect(question).toHaveAttribute('aria-expanded', 'false');
  });
});
