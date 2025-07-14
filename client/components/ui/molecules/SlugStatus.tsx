'use client';

import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';

interface SlugStatusProps {
  status: 'idle' | 'checking' | 'available' | 'taken' | 'error';
}

export const SlugStatus: React.FC<SlugStatusProps> = ({ status }) => {
    
  switch (status) {
    case 'checking':
      return (
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Checking availability...
        </div>
      );
    case 'available':
      return (
        <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
          <Check className="w-4 h-4" /> Available!
        </div>
      );
    case 'taken':
      return (
        <div className="flex items-center text-sm text-red-600 dark:text-red-400 font-medium">
          <X className="w-4 h-4" /> Already taken
        </div>
      );
    case 'error':
      return (
        <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 font-medium">
          <AlertTriangle className="w-4 h-4" /> Error checking availability
        </div>
      );
    default:
      return null;
  }
};