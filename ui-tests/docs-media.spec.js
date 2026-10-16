import { mkdirSync, writeFileSync } from 'node:fs';
import { card, dialog, expect, NOW, openApp, settle, test } from './fixtures';

// Generates the README screenshots and the hero clip from the demo data.
// Not a test: `npm run docs:media` runs it (only then is this project
// enabled) and converts the results to WebP, GIF and MP4.
//
// Screenshots come in light and dark so the README can follow the reader's
// GitHub theme.

const OUT = 'readme-img/src';
const DESKTOP = { width: 1280, height: 800 };
const TALL = { width: 1280, height: 1080 };
const PHONE = { width: 390, height: 844 };
const BACKGROUND = { light: '#F8FAFC', dark: '#0B1120' };

mkdirSync(OUT, { recursive: true });

async function newPage(browser, { colorScheme, viewport, mobile, video }) {
  const context = await browser.newContext({
    colorScheme,
    viewport,
    deviceScaleFactor: video ? 1 : 2,
    isMobile: !!mobile,
    hasTouch: !!mobile,
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    ...(video && { recordVideo: { dir: OUT, size: viewport } }),
  });
  const page = await context.newPage();
  await page.clock.setFixedTime(NOW);
  return page;
}

const ready = async page => {
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
};

// The open dialog plus a margin of the blurred page around it.
async function dialogShot(page, path, margin = 40) {
  await ready(page);
  const box = await page.locator('.MuiDialog-paper').last().boundingBox();
  const { width, height } = page.viewportSize();
  const x = Math.max(0, box.x - margin);
  const y = Math.max(0, box.y - margin);
  return page.screenshot({
    path,
    clip: {
      x,
      y,
      width: Math.min(width - x, box.width + margin * 2),
      height: Math.min(height - y, box.height + margin * 2),
    },
  });
}

// Renders images side by side on a plain page and saves the row.
async function saveRow(page, shots, path, { background, imgStyle }) {
  const imgs = shots
    .map(
      png =>
        `<img src="data:image/png;base64,${png.toString('base64')}" style="${imgStyle}">`
    )
    .join('');
  await page.setViewportSize({ width: 2400, height: 1400 });
  await page.setContent(
    `<body style="margin:0;background:${background}">
      <div id="row" style="display:inline-flex;align-items:flex-start;gap:40px;padding:40px">${imgs}</div>
    </body>`
  );
  return page.locator('#row').screenshot({ path });
}

async function openStripe(page, tab) {
  await openApp(page, { 'mock-delay': '0' });
  await card(page, 'Stripe')
    .getByRole('button', { name: 'Edit Stripe' })
    .click();
  const job = dialog(page, 'Stripe');
  if (tab) await job.getByRole('tab', { name: tab }).click();
  return job;
}

const dialogs = {
  application: async page => {
    const job = await openStripe(page);
    await expect(job.getByLabel('Company name')).toHaveValue('Stripe');
  },
  interviews: async page => {
    const job = await openStripe(page, /Interviews/);
    await expect(job.getByLabel('Interviewer')).toHaveCount(2);
  },
  offer: async page => {
    const job = await openStripe(page, 'Offer');
    await expect(job.getByLabel('Salary offered')).toHaveValue(/215k/);
  },
  profile: async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(dialog(page, 'Profile').getByLabel('City')).toHaveValue(
      'City'
    );
  },
  'interview-list': async page => {
    await openApp(page, { 'mock-delay': '0' });
    await page.getByRole('button', { name: 'Interview list' }).click();
    await expect(dialog(page, 'Interview list').getByRole('row')).toHaveCount(
      7
    );
  },
};

test.describe.configure({ mode: 'parallel' });

for (const colorScheme of ['light', 'dark']) {
  const background = BACKGROUND[colorScheme];

  for (const [name, show] of Object.entries(dialogs)) {
    test(`${name} ${colorScheme}`, async ({ browser }) => {
      const page = await newPage(browser, { colorScheme, viewport: DESKTOP });
      await show(page);
      await dialogShot(page, `${OUT}/${name}-${colorScheme}.png`);
    });
  }

  test(`bookmarks and Q&A ${colorScheme}`, async ({ browser }) => {
    // Taller, so the bookmark grid is not cut off mid-row.
    const page = await newPage(browser, { colorScheme, viewport: TALL });
    const shots = [];
    for (const [name, content] of [
      ['Bookmarks', 'LinkedIn Jobs'],
      ['Q&A', 'Why are you interested'],
    ]) {
      await openApp(page, { 'mock-delay': '0' });
      await page.getByRole('button', { name, exact: true }).click();
      await expect(dialog(page, name)).toContainText(content);
      if (name === 'Q&A') {
        await dialog(page, name)
          .getByRole('button', {
            name: 'Why are you interested in this role?',
            exact: true,
          })
          .click();
      }
      shots.push(await dialogShot(page, undefined, 0));
    }
    await saveRow(page, shots, `${OUT}/collections-${colorScheme}.png`, {
      background,
      imgStyle:
        'width:880px;border-radius:16px;box-shadow:0 12px 40px rgba(15,23,42,.2)',
    });
  });
}

// Width in CSS pixels of a 2x PNG (the width sits in the IHDR chunk).
const cssWidth = png => png.readUInt32BE(16) / 2;

// One image from a light and a dark shot of the same size: light top-left,
// dark bottom-right, split on a diagonal.
async function saveSplit(browser, { light, dark }, path) {
  const page = await newPage(browser, {
    colorScheme: 'light',
    viewport: DESKTOP,
  });
  await page.setViewportSize({ width: cssWidth(light) + 100, height: 2000 });
  const src = png => `data:image/png;base64,${png.toString('base64')}`;
  await page.setContent(`
    <body style="margin:0">
      <div id="split" style="position:relative;display:inline-block">
        <img src="${src(dark)}" style="display:block;width:${cssWidth(dark)}px">
        <img src="${src(light)}"
          style="position:absolute;inset:0;width:100%;clip-path:polygon(0 0,62% 0,38% 100%,0 100%)">
      </div>
    </body>`);
  await page.locator('#split').screenshot({ path });
  await page.context().close();
}

test('board split', async ({ browser }) => {
  const shots = {};
  for (const colorScheme of ['light', 'dark']) {
    const page = await newPage(browser, { colorScheme, viewport: DESKTOP });
    await openApp(page, { 'mock-delay': '0' });
    await ready(page);
    shots[colorScheme] = await page.screenshot();
    await page.context().close();
  }
  await saveSplit(browser, shots, `${OUT}/board-split.png`);
});

// Board, menu and an application on three phones.
async function phoneRow(browser, colorScheme) {
  const page = await newPage(browser, {
    colorScheme,
    viewport: PHONE,
    mobile: true,
  });
  const shots = [];
  await openApp(page, { 'mock-delay': '0' });
  await ready(page);
  shots.push(await page.screenshot());

  await page.getByRole('button', { name: 'More actions' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await ready(page);
  shots.push(await page.screenshot());
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();

  const job = await openStripe(page);
  await expect(job.getByLabel('Company name')).toHaveValue('Stripe');
  await ready(page);
  shots.push(await page.screenshot());

  const row = await saveRow(page, shots, undefined, {
    background: BACKGROUND[colorScheme],
    imgStyle:
      'width:340px;border-radius:32px;border:10px solid #0F172A;box-shadow:0 16px 48px rgba(15,23,42,.25)',
  });
  await page.context().close();
  return row;
}

test('mobile split', async ({ browser }) => {
  await saveSplit(
    browser,
    {
      light: await phoneRow(browser, 'light'),
      dark: await phoneRow(browser, 'dark'),
    },
    `${OUT}/mobile-split.png`
  );
});

// --- Hero clip -------------------------------------------------------------

// Overlays drawn into the page while recording: a cursor (Playwright does not
// record the mouse) and a caption naming the feature on screen, with a speed
// tag while that stretch plays fast.
const OVERLAYS = `
  addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.style.cssText = 'position:fixed;z-index:99999;left:700px;top:30px;width:22px;height:22px;' +
      'pointer-events:none;transition:transform .12s;margin:-2px 0 0 -2px';
    cursor.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 2l7 19 2.6-7.4L20 11z" ' +
      'fill="#0F172A" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.body.appendChild(cursor);
    addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', () => { cursor.style.transform = 'scale(.8)'; }, true);
    addEventListener('mouseup', () => { cursor.style.transform = ''; }, true);

    const caption = document.createElement('div');
    // Sized for a phone feed: the 1280px clip shows about 360px wide there.
    caption.style.cssText = 'position:fixed;z-index:99998;left:50%;bottom:28px;transform:translateX(-50%);' +
      'display:none;align-items:center;gap:16px;padding:14px 30px;border-radius:999px;white-space:nowrap;' +
      'pointer-events:none;background:rgba(15,23,42,.92);color:#fff;' +
      'font:700 42px/1.15 "Inter Variable",system-ui,sans-serif;box-shadow:0 10px 32px rgba(15,23,42,.35)';
    caption.id = 'clip-caption';
    document.body.appendChild(caption);
    // Light pill once the app switches to dark mode (MUI puts .dark on <html>).
    const style = document.createElement('style');
    style.textContent = 'html.dark #clip-caption{background:rgba(226,232,240,.94)!important;color:#0B1020!important}';
    document.head.appendChild(style);
    window.__caption = (text, fast) => {
      caption.style.display = text ? 'inline-flex' : 'none';
      caption.innerHTML = text +
        (fast ? '<span style="padding:4px 16px;border-radius:999px;background:#818CF8;color:#0B1020;font-size:34px">' + fast + '×</span>' : '');
    };
  });`;

const SPEED_UP = 3;

async function glideTo(page, locator) {
  const box = await locator.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 24,
  });
}

async function clickOn(page, locator, pause = 700) {
  await glideTo(page, locator);
  await page.waitForTimeout(200);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(pause);
}

// Tracks the recording timeline: where the clip starts and which stretches
// (typing) the conversion speeds up.
function timeline() {
  const t0 = Date.now();
  const now = () => (Date.now() - t0) / 1000;
  const fast = [];
  let start = 0;
  return {
    start: () => {
      start = now();
    },
    fast: async (page, caption, action) => {
      await page.evaluate(
        ([c, x]) => window.__caption(c, x),
        [caption, SPEED_UP]
      );
      const from = now();
      await action();
      fast.push([from, now()]);
      await page.evaluate(c => window.__caption(c), caption);
    },
    save: path =>
      writeFileSync(
        path,
        JSON.stringify({ start, end: now(), speed: SPEED_UP, fast }, null, 2)
      ),
  };
}

const caption = (page, text) => page.evaluate(t => window.__caption(t), text);

async function type(page, field, text) {
  await clickOn(page, field, 150);
  await field.pressSequentially(text, { delay: 55 });
}

test('hero clip', async ({ browser }) => {
  test.setTimeout(180_000);
  const page = await newPage(browser, {
    colorScheme: 'light',
    viewport: DESKTOP,
    video: true,
  });
  const clip = timeline();
  await page.addInitScript(OVERLAYS);
  await openApp(page, { 'mock-delay': '200' });
  // Header badges and avatar load after the cards.
  await expect(page.getByRole('button', { name: 'Account menu' })).toHaveText(
    'JC'
  );
  await expect(page.getByRole('button', { name: 'Offer list' })).toHaveText(
    '3'
  );
  await page.mouse.move(700, 30);
  await settle(page);
  clip.start();

  // 1. The board.
  await caption(page, 'Your job search at a glance');
  await page.waitForTimeout(2200);

  // 2. Add an application.
  await caption(page, 'Add an application');
  await clickOn(
    page,
    page.getByRole('button', { name: 'New application' }),
    900
  );
  const form = dialog(page, 'New application');
  await clip.fast(page, 'Add an application', async () => {
    await type(page, form.getByLabel('Company name'), 'Acme Robotics');
    await type(page, form.getByLabel('Job title'), 'Frontend Engineer');
    await type(page, form.getByLabel('Salary range'), '150k-180k');
    await type(
      page,
      form.getByLabel('Description'),
      'Fleet dashboards in React'
    );
  });
  await clickOn(
    page,
    form.getByRole('button', { name: 'Save application' }),
    1800
  );

  // 3. Filter by status; the new application leads the open ones.
  await caption(page, 'Filter by status');
  await clickOn(page, page.getByRole('button', { name: /^Open/ }), 1800);

  // 4. Track interviews.
  await caption(page, 'Track interviews');
  await clickOn(
    page,
    card(page, 'Acme Robotics').getByRole('button', {
      name: 'Edit Acme Robotics',
    }),
    900
  );
  const job = dialog(page, 'Acme Robotics');
  await clickOn(page, job.getByRole('tab', { name: /Interviews/ }), 900);
  await clickOn(page, job.getByRole('button', { name: 'Add interview' }), 1300);
  await clip.fast(page, 'Track interviews', async () => {
    await type(page, job.getByLabel('Interviewer'), 'Jordan Lee');
    await type(
      page,
      job.getByLabel('Description'),
      'Intro call with the hiring manager'
    );
  });
  await caption(page, 'Changes save automatically');
  await clickOn(
    page,
    job.getByRole('heading', { name: 'Acme Robotics' }),
    1800
  );
  await clickOn(page, job.getByRole('button', { name: 'Done' }), 900);

  // 5. Upcoming interviews: the badge went up; the list has the new one.
  await caption(page, 'See what is coming up');
  const list = page.getByRole('button', { name: 'Interview list' });
  await expect(list).toHaveText('7');
  await glideTo(page, list);
  await page.waitForTimeout(900);
  await clickOn(page, list, 1000);
  const upcoming = dialog(page, 'Interview list');
  await expect(upcoming).toContainText('Acme Robotics');
  await glideTo(page, upcoming.getByRole('row', { name: /Acme Robotics/ }));
  await page.waitForTimeout(1800);
  await clickOn(
    page,
    upcoming.getByRole('button', { name: 'Close' }).first(),
    700
  );

  // 6. Dark mode, then rest on empty header space so no tooltip or card
  // hover shows.
  await caption(page, 'Light and dark mode');
  await clickOn(page, page.getByRole('button', { name: 'Dark mode' }), 300);
  await page.mouse.move(700, 30, { steps: 20 });
  await page.waitForTimeout(2400);

  clip.save(`${OUT}/hero-timeline.json`);
  const video = page.video();
  await page.context().close();
  await video.saveAs(`${OUT}/hero.webm`);
  await video.delete();
});
