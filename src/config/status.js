// Job application statuses, in the order the filter bar shows them.
// Colors live in the theme palette under `status.<name>`.
export const JOB_STATUSES = ['open', 'active', 'ghosted', 'rejected'];

// Order of cards in the list: most actionable first.
export const STATUS_SORT_ORDER = {
  active: 1,
  open: 2,
  ghosted: 3,
  rejected: 4,
};

const isKnownStatus = status =>
  status === 'all' || JOB_STATUSES.includes(status);

// Returns an sx palette path such as 'status.open.main', or `fallback` for an
// unknown status so callers never emit an invalid color.
export const statusColor = (status, tone = 'main', fallback = 'divider') =>
  isKnownStatus(status) ? `status.${status}.${tone}` : fallback;
