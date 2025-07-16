'use client'

import { useMemo } from 'react'

export function usePagination<T>(
  items: T[],
  itemsPerPage: number,
  currentPage: number
) {
  const totalPages = Math.ceil(items.length / itemsPerPage)
  
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, currentPage, itemsPerPage])

  return {
    currentItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, items.length),
    totalItems: items.length
  }
}