'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';

export const useSlugChecker = (slug: string) => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const { checkSlugAvailability } = useWorkspace();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
     if (slug.length >= 3) {
        handleSlugCheck(slug);
      } else if (slug.length >= 0) {
        setStatus('idle');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [slug]);

  const handleSlugCheck = async (slugToCheck: string) => {
    try {
      setStatus('checking');
      const response = await checkSlugAvailability(slugToCheck);
      setStatus(response.available ? 'available' : 'taken');
    } catch (error) {
      console.error('Error checking slug availability:', error);
      setStatus('error');
    }
  };

  return { status, setStatus };
};