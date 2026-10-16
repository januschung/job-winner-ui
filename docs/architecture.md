# UI architecture

A short map of how the Job Winner UI is put together, for anyone changing it.
The stack is React 19, Apollo Client 4, MUI 9 and Vite, in plain JavaScript.

## App shell

`src/index.jsx` creates the Apollo client and renders `App`, which nests:

- `ThemeContextProvider`: MUI theme, light/dark mode (saved under the
  `theme` localStorage key; `index.html` applies it before React loads, so
  there is no light flash).
- `SnackbarProvider`: the one app-wide message (`useSnackbar().showSnackbar`).
- `AppDialogsProvider`: owns the header's dialogs (new application, bookmarks,
  Q&A, profile, interview list, offer list) and the header badge counts. Open
  them with `useAppDialogs()`, e.g. `openNewJobApplication()`.
- `AppHeader` and `JobApplicationList` (the board).

The backend URL comes from `window.APP_CONFIG`, set by `/config.js`. The Docker
entrypoint generates that file; in dev and preview, Vite serves an empty one,
so the app falls back to `http://localhost:8080/graphql`.

## Theme and status colors

- `src/config/theme.js` defines both color schemes as CSS variables. Read
  colors through `sx` palette paths (`'text.secondary'`) or `theme.vars`,
  not `theme.palette`, which always holds the light values.
- Job statuses (`open`, `active`, `ghosted`, `rejected`, plus `all`) have
  tones under `palette.status.<status>`: `main`, `soft`/`text` for tinted
  chips, `solid`/`solidText` for the selected filter. All text pairs pass
  WCAG AA.
- `src/config/status.js` holds the status order, the card sort order and
  `statusColor(status, tone)`, which returns a safe palette path for unknown
  statuses too. Interview statuses borrow a job tone through
  `INTERVIEW_STATUS_TONE`.
- `StatusBadge` is the tinted pill used on cards, dialogs and interviews.

## Dialogs

Shared pieces in `src/components/common/`:

| Piece              | Use it for                                                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CustomDialog`     | Every dialog's frame: title, optional subtitle and header element, close button, and footer actions (`onCancel`, `onAdd`, `onSave`). Full screen on phones. |
| `DialogFooter`     | A footer with custom buttons and an optional note on the left (e.g. "Changes save automatically").                                                          |
| `ConfirmDialog`    | Confirming a destructive action. Pair it with `useConfirmedAction`.                                                                                         |
| `RecordFormDialog` | Add/edit forms made of required text fields (bookmarks, Q&A).                                                                                               |
| `RecordListDialog` | Sortable tables of records that link to an application (interview list, offer list).                                                                        |
| `CollectionDialog` | A list dialog with an "Add" button (bookmarks, Q&A).                                                                                                        |
| `EmptyState`       | Centered placeholder with optional actions.                                                                                                                 |

Large dialogs load on demand: import them from `components/lazyDialogs.js` and
render them inside `<MountOnFirstOpen open={...}>`. `prefetchDialogs()` warms
the chunks when the browser is idle.

## Saving and confirming

Use these hooks rather than calling mutations and the snackbar by hand:

- `useAsyncAction()` → `run(action, { successMessage, errorMessage, onSuccess })`.
  It shows the success message only after the action resolves, the error
  message if it throws, and exposes `pending` for disabling buttons. On
  failure, dialogs stay open so nothing typed is lost.
- `useConfirmedAction({ action, successMessage, errorMessage, onSuccess })`
  → `request(item)` opens the confirmation; spread `dialogProps` onto
  `ConfirmDialog`.
- `useDialog(refetch?)` → `{ open, item, handleOpen(item), handleClose }`.
  The item stays set while the dialog closes, so its content does not blank
  out mid-animation.

Interviews save inline: a status change or calendar pick saves at once, typed
text and dates save on blur, and fields left unchanged send nothing.

## Text and languages

All UI text lives in `src/locales/en.json` and `es.json` (i18next). Use
sentence case ("Company name"), and add every key to both files.

## Mock API (`npm run dev:mock`)

`src/dev/mockApi` answers GraphQL in the browser using the backend's real
schema and demo data, so the UI runs without a backend. Production builds
drop it. URL knobs: `?mock-delay=ms`, `?mock-fail=OperationName,...`,
`?mock-data=empty`. `window.__mockApi` exposes the operations sent and the
live fail list, for tests. Refresh the schema and data with
`npm run mock:sync -- /path/to/job-winner`.

## Tests

| Command                  | What runs                                                                       | Where                     |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------------- |
| `npm test`               | Unit and component tests (Vitest, jsdom)                                        | `src/**/__tests__`        |
| `npm run test:ui`        | Browser tests against `dev:mock`: flows, accessibility (axe), no console errors | `ui-tests/*.spec.js`      |
| `npm run test:ui:visual` | Screenshot comparisons, light and dark, in the Playwright Linux image (Docker)  | `ui-tests/visual.spec.js` |

### Adding a UI test

1. Pick the spec file for the area (jobs, list, collections,
   interviews-offers, header) and import helpers from `ui-tests/fixtures.js`:
   `openApp(page, knobs)`, `card(page, company)`, `dialog(page, name)`,
   `snackbar(page, text)`, `operationsNamed(page, name)`,
   `expectAccessible(page)`.
2. Find elements by role and accessible name, as a screen reader would. If
   that is not possible, the element probably needs a label.
3. Use mock knobs for error and empty paths, and `operationsNamed` to check
   what was (or was not) saved.
4. The clock is fixed at `NOW` (Jun 15, 2026), so demo dates are stable.

A new screen also deserves a view in `visual.spec.js` and a check in
`a11y.spec.js`; then update the baselines with
`npm run test:ui:visual -- --update-snapshots` and review them in the diff.

## README media

`npm run docs:media` regenerates every image and the hero clip in
`readme-img/` from `ui-tests/docs-media.spec.js`, in Docker. Rerun it after
visual changes so the README matches the app.
