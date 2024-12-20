/**
 * Sorts an array of objects by a given key with an optional nested field.
 * @param {Array} data - The array of objects to sort.
 * @param {string} key - The key to sort by.
 * @param {string} direction - The sort direction ('asc' or 'desc').
 * @param {boolean} isNested - Whether the key is nested in an object.
 * @returns {Array} - The sorted array.
 */
export function sortData(data, key, direction, isNested = false) {
  return [...data].sort((a, b) => {
    const aValue = isNested ? a.jobApplication[key]?.toLowerCase() : a[key]?.toLowerCase();
    const bValue = isNested ? b.jobApplication[key]?.toLowerCase() : b[key]?.toLowerCase();

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}
