# Job Winner UI: what's next

The redesign roadmap is done: MUI 9 and Node 26, the new theme, status
system, header, cards and dialogs; the save fixes, the `dev:mock` stub
backend, `.jsx` linting, the shared hooks and components, and React 19 with
Apollo 4 and a split bundle. The app looks and behaves well. What it lacks is
**protection against regressions**: most of that verification ran from
throwaway scripts outside the repo. This plan moves it into the repo first,
then covers the gaps that turned up along the way.

Phases are in priority order. Each one is a separate PR.

---

## Phase 0: ship what's done *(done: merged in #187)*

| | |
|---|---|
| **What** | Commit step 7, then open one PR for `fix-save-feedback` (save fixes, `dev:mock`, linting, DRY refactor, dependency upgrades, dialog redesign). |
| **Why** | Everything after this builds on it. The branch is stacked; if any part is squash-merged separately first, the rest needs a rebase. |
| **Done when** | Merged to `main`, CI green, Docker image built by `deploy.yml`. |

---

## Phase 1: regression safety net *(done, on branch `phase-1-ui-tests`)*

**Status:** 75 UI and accessibility tests plus 34 screenshot comparisons, all
passing in CI settings in about 1.8 minutes. Differences from the plan below:

- CI runs inside the Playwright Docker image instead of caching browsers, so
  CI and local `npm run test:ui:visual` render screenshots identically.
- Tests also fail on any uncaught error or `console.error` in the page.
- The mock API gained `?mock-data=empty` and `window.__mockApi` (operations
  sent, live fail list) for the tests.
- Bugs the tests found, now fixed: the Status dropdowns had no accessible
  name; snackbar messages were hidden from screen readers while a dialog was
  open; Q&A edit/delete buttons were nested inside the accordion button;
  invalid language heading in menus; low-contrast bookmark avatars, offer
  Delete button and dark-mode red buttons; a Tooltip switching between
  controlled and uncontrolled in `CopyButton`.


The UI is now polished, but almost nothing in CI would catch a broken dialog,
a wrong status color or a mobile overflow. During the redesign that safety
came from Playwright scripts and pixel diffs run by hand.

Two kinds of browser test, named for what they actually prove:

| Suite | Runs against | Proves | When |
|---|---|---|---|
| **UI tests** (`ui-tests/`, `npm run test:ui`) | the real frontend plus the in-browser mock API (`dev:mock`) | the UI works: flows, layout, accessibility | every PR |
| **E2E smoke tests** (`e2e/`, `npm run test:e2e`) | the frontend and the real backend in demo mode | the whole stack works together | iceboxed (see Icebox) |

UI tests are fast and deterministic, so they carry most of the coverage. They
can't see the backend; the checks for that are in the Icebox.

### 1.1 UI tests against `dev:mock`
- Add `@playwright/test`, a `ui-tests/` folder and `npm run test:ui`, which
  starts `vite --mode mock` and runs against it.
- Port the flows already proven useful:
  - job: create, edit, delete, and a failed delete (`?mock-fail=`)
  - status chip filtering, Clear, empty search and no-match states
  - bookmarks and Q&A add/edit/delete; "Add" starts blank
  - interviews: status saves immediately, calendar date saves, typed date
    saves once on blur, unchanged fields send nothing, failed delete
  - offers: add, persist, delete; no "Add Offer" before the offer loads
  - header: "/" shortcut, account menu, Spanish, mobile menu and the
    floating "+" button
  - errors: Retry after a failed load
- This also covers the code jsdom can't render: the interviews tab crashes
  jsdom's selector engine because of the date picker.
- **Done when:** about 40 specs pass locally and in CI in under 2 minutes.

### 1.2 Visual regression
- Use Playwright's `toHaveScreenshot()` for about 12 key views: home, filter,
  empty, error and loading, each dialog, and mobile, in light and dark.
- Freeze the clock (demo dates are relative to today) and wait for dialog
  fade-ins, which were the two sources of flaky shots during the redesign.
- **Done when:** baseline images are committed, and CI fails on any diff
  beyond a small tolerance, with the diff attached.

### 1.3 Accessibility checks
- Run `@axe-core/playwright` inside the UI test flows, and add
  `eslint-plugin-jsx-a11y`.
- Codifies things fixed by hand during the redesign: labelled icon buttons,
  `aria-pressed` on filters, no nested buttons, unique IDs.
- **Done when:** no serious or critical axe violations on any covered view.

### 1.4 CI wiring
- Add a `ui-tests` job (with a Playwright browser cache) and a Docker build
  check on pull requests, since today only `deploy.yml` builds the image.

---

## Phase 2: code health

| Item | Why | Size |
|---|---|---|
| **Enable `eslint-plugin-react-hooks`** | Several effects leave out dependencies on purpose (`RecordFormDialog`, `JobApplicationList`, `InterviewsForm`). The rule would separate intentional cases (comment them) from real stale-state bugs. | S–M |
| **Dev fallback for `/config.js`** | Every dev page load logs a 404, because only the Docker entrypoint generates the file. Ship a dev-only stub, or skip the script outside production. | XS |
| **Fold `useJobApplicationDialog` into `useDialog`** | It's `useDialog` plus a selected item. Left alone in the DRY pass because old tests mocked `useDialog`; those mocks are gone now. | S |
| **Consistent field labels** | Labels are Title Case ("Company Name") while the new UI uses sentence case. Change both locales and update the tests that query labels. | S |
| **Incremental TypeScript (optional)** | Prop checking was turned off because there are no PropTypes. Start with `config/`, `hooks/`, `utils/` and the mock API, then shared components. | L |

---

## Phase 3: performance

The first page loads 832 KB (260 KB gzipped): MUI 284 KB, React 219 KB,
Apollo with `rxjs` 197 KB, the app 122 KB.

- **Load the Spanish locale on demand.** Both locales ship up front today.
- **Measure in production** with Lighthouse in CI (or a bundle-size budget
  check) so growth is caught early. **Done when** a PR that grows initial JS
  by more than 5% fails, or at least warns.
- **Check the dev-only first dialog open.** Lazy dialogs fade in a beat late
  in dev; production prefetches them when the browser is idle. Confirm on a
  slow-network profile that the prefetch arrives before a typical first
  click.

---

## Phase 4: docs and portfolio presentation

### 4.1 README media generated from the UI tests
All eight images in `readme-img/` show the old UI. Instead of re-capturing them
by hand (which is why they went stale), generate all README media from the
Phase 1 specs, running against `npm run dev:mock` so they use the demo data.

- **One hero clip** (15–25 s, MP4) at the top of the README showing the core
  loop: filter by status → open a job → add an interview → confirmation →
  dark mode. Upload it through GitHub's editor so it plays inline
  (`github.com/user-attachments/...` URL); a video committed to the repo shows
  only as a link.
- **Static screenshots** for each feature section (light and dark, desktop and
  mobile). They scan faster than video and show detail better.
- **A few optional 5–10 s clips** only where motion matters (mobile scrolling
  chips, a calendar pick saving instantly, the `/` shortcut), inside
  `<details>` so the README stays light. Keep GIFs narrow, low-fps and a few
  MB at most; prefer MP4.
- **How:** a "demo" variant of selected specs with Playwright video recording,
  slowed down (test speed is unwatchable), a visible cursor overlay (Playwright
  doesn't record the mouse), and the clock frozen; then `ffmpeg` converts to
  MP4/GIF. Wrapped as `npm run docs:media`.
- **Not** one video per component: too heavy, too slow to scroll, and too many
  files to keep current.
- **Done when:** one command regenerates every README image and clip, and the
  README shows the current UI.
- **Size:** about half a day on top of Phase 1.1 (same specs and setup).

### 4.2 Architecture notes
- **Document the UI architecture** briefly: theme tokens and status palette,
  the shared dialog pieces, the save/confirm hooks, `dev:mock`, and how to add
  a UI test.

---

## Backlog: not yet decided

### "Show me around" guided tour *(proposed, not finalized)*
A short tour for first-time demo visitors (recruiters, hiring managers) who
won't discover the non-obvious features by clicking around.

- **Proposed shape:** 4–5 small, skippable popovers anchored to real elements:
  1. status chips filter the board
  2. each card holds interviews and an offer, not just the application
  3. header badges show upcoming interviews and offers
  4. Q&A keeps interview answers handy
  5. `/` searches, the moon switches to dark mode, Spanish is in the account
     menu
- **Rules:** non-blocking, Next / Back / Skip, Esc closes, keyboard
  accessible. Auto-starts **once** on a first visit to the demo (remembered in
  `localStorage`), always available as "Take a tour" in the account menu, never
  auto-starts for normal installs. Loaded lazily so first-page JS stays at
  832 KB.
- **Build:** custom on MUI `Popper` to match the theme (preferred), or a small
  library such as driver.js (faster).
- **Open questions:** the exact steps and copy; whether "demo" is detected by a
  flag, the backend's demo mode, or the deployed URL; custom vs. library.
- **Process:** mockup first, then before/after screenshots; UI test coverage once
  Phase 1 exists.
- **Size:** about a day. Best done after Phase 1.1, or earlier if the demo link
  is about to be shared widely. Its steps are natural clips for 4.1.

---

## Icebox

### Backend contract and E2E smoke tests *(was Phase 1.5)*
The mock API answers however it was written, so if the backend renames a
field the UI tests stay green while the deployed app breaks.

- **Schema drift check:** a unit test already validates every query and
  mutation in `src/graphql/` against `src/dev/mockApi/schema.graphqls`, but
  that file is a copy refreshed only by `npm run mock:sync`. Close the gap by
  checking it against the backend's current schema in CI.
- **E2E smoke tests:** start the backend in its demo mode plus the frontend
  Docker image, then run 3–5 critical flows (load the board, create and edit
  a job, add an interview, save an offer) with the same Playwright setup.
  Also covers deployment wiring: the generated `/config.js`, the backend URL
  and CORS. Run nightly or before a release, not the full UI suite.
- **Revisit when:** the backend API changes often, or a deploy breaks in a way
  the UI tests couldn't see.

---

## Parked decisions

- **Profile `id: 1`** is hard-coded in `AppDialogsContext` and
  `ProfileDialog`. Deliberately left as is; revisit if the backend gains
  multiple users or auth.
- **Stats/insights:** the stats row was removed as redundant. A slim insight
  line ("6 applied this month · 42% response rate") is still an option.
- **Stat cards vs. chips:** settled by removing the cards; the chips are the
  only filter.

---

## Suggested order

1. ~~Phase 0: merge what's done.~~ Done (#187).
2. ~~Phase 1: UI tests, visual and accessibility checks, CI.~~ Done.
3. Phase 4.1: README media generated from the UI test specs (it reuses the
   same setup).
4. Backlog: "show me around" tour, once its open questions are settled.
5. Phases 2 and 3 as ongoing improvements.
