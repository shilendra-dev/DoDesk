'use client';

import React from 'react';
import { Input } from '@/components/ui/atoms/input';
import { Label } from '@/components/ui/atoms/label';
import { SlugStatus } from './SlugStatus';
import { useSlugChecker } from '@/hooks/useSlugChecker';
import { Info } from 'lucide-react';

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  onStatusChange?: (status: 'idle' | 'checking' | 'available' | 'taken' | 'error') => void;
  onUserInteraction?: () => void; // New prop
  label?: string;
  placeholder?: string;
  className?: string;
}

export const SlugInput: React.FC<SlugInputProps> = ({
  value,
  onChange,
  onStatusChange,
  onUserInteraction,
  label = "Workspace URL",
  placeholder = "acme-marketing",
  className = ""
}) => {
  const { status, setStatus } = useSlugChecker(value);

  React.useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  const handleInputChange = (inputValue: string) => {
    const cleanValue = inputValue.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    if (inputValue.length === 0 || cleanValue.length === 0) {
      setStatus('idle');
    }
    
    onChange(cleanValue);
  };

  // Detect user interaction
  const handleFocus = () => {
    onUserInteraction?.();
  };

  const handleKeyDown = () => {
    onUserInteraction?.();
  };

  // Handle the "too short" message
  const getStatusDisplay = () => {
    if (value.length > 0 && value.length < 3) {
      return (
        <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium gap-2">
          <Info className="w-4 h-4" />
          Type at least 3 characters
        </div>
      );
    }
    return <SlugStatus status={status} />;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="workspace-slug">{label}</Label>
      <Input
        id="workspace-slug"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={`${
          status === 'available' ? 'border-green-500' : 
          status === 'taken' ? 'border-red-500' : ''
        } ${className}`}
        required
      />
      <div className="text-xs text-muted-foreground font-mono">
        dodesk.app/{value || 'your-workspace'}
      </div>
      {getStatusDisplay()}
    </div>
  );
};