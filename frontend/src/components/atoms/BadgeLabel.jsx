import React from 'react';

const getBadgeClass = (type, value) => {
  const base = {
    status: {
      "pending": 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      "in-progress": 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      "completed": 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    priority: {
      "low": 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      "mid": 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      "high": 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
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
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeClass} ${className}`}>
      {formatLabel(value)}
    </span>
  );
};

export default BadgeLabel;
