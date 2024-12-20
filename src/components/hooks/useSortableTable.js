import { useState } from 'react';

const useSortableTable = (data, columns) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  // Function to get the value from a nested object
  const getValue = (item, key) => {
    const keys = key.split('.'); // Split key into parts for nested access
    return keys.reduce((obj, keyPart) => obj && obj[keyPart], item);
  };

  const sortedData = sortConfig.key
    ? [...data].sort((a, b) => {
        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : data;

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return {
    sortedData,
    handleSort,
    getSortIndicator,
  };
};

export default useSortableTable;
