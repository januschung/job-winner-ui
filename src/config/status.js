// Job application statuses, in the order the filter bar shows them.
// Colors live in the theme palette under `status.<name>`.
export const JOB_STATUSES = ['open', 'active', 'ghosted', 'rejected'];

const isKnownStatus = status =>
  status === 'all' || JOB_STATUSES.includes(status);

// Returns an sx palette path such as 'status.open.main', or `fallback` for an
// unknown status so callers never emit an invalid color.
export const statusColor = (status, tone = 'main', fallback = 'divider') =>
  isKnownStatus(status) ? `status.${status}.${tone}` : fallback;
