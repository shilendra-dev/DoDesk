import React from 'react';

const getBadgeClass = (type, value) => {
  const base = {
    status: {
      "pending": 'bg-[var(--color-badge)] dark:text-[var(--status-pending)] text-[var(--status-pending)]',
      "in-progress": 'bg-[var(--color-badge)] dark:text-[var(--status-in-progress)] text-[var(--status-in-progress)]',
      "completed": 'bg-[var(--color-badge)] dark:text-[var(--status-completed)] text-[var(--status-completed)]',
    },
    priority: {
      "low": 'bg-[var(--color-badge)] dark:text-[var(--priority-low)] text-[var(--priority-low)]',
      "mid": 'bg-[var(--color-badge)] dark:text-[var(--priority-mid)] text-[var(--priority-mid)]',
      "high": 'bg-[var(--color-badge)] dark:text-[var(--priority-high)] text-[var(--priority-high)]',
    },
  };

  return base[type]?.[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const formatLabel = (value) => {
  return value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const BadgeLabel = ({ type, value, className = "" }) => {
  const badgeClass = getBadgeClass(type, value.toLowerCase());

  return (
    <span className={`text-xs font-medium select-none px-2.5 py-0.5 rounded-full ${badgeClass} ${className}`}>
      {formatLabel(value)}
    </span>
  );
};

export default BadgeLabel;
