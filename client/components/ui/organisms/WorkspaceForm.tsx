'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/atoms/button';
import { Input } from '@/components/ui/atoms/input';
import { Label } from '@/components/ui/atoms/label';
import { SlugInput } from '@/components/ui/molecules/SlugInput';
import { useWorkspace } from '@/hooks/useWorkspace';

interface WorkspaceFormProps {
  onSuccess: (workspace: unknown) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export const WorkspaceForm: React.FC<WorkspaceFormProps> = ({
  onSuccess,
  onCancel,
  submitText = 'Create Workspace',
  cancelText = 'Back',
  showCancel = true
}) => {
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const { createWorkspace, loading } = useWorkspace();
  const [ isSlugManuallyEdited, setIsSlugManuallyEdited ] = useState(false);

  const generateSlugFromName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

   // Auto-generate slug from name
   useEffect(() => {
    if (formData.name && !isSlugManuallyEdited) {
      const generatedSlug = generateSlugFromName(formData.name);
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, isSlugManuallyEdited]);

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ ...prev, name }));
  };

  const handleSlugChange = (slug: string) => {
    setFormData(prev => ({ ...prev, slug }));
    
    // Mark as manually edited if user types anything
    setIsSlugManuallyEdited(true);
  };

  const handleSubmit = async (  e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createWorkspace(formData);
      if (result.status === 201) {
        onSuccess(result.workspace);
      } else {
        alert(result.message);
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error creating workspace';
      alert(errorMessage);
    }
  };

  const isFormValid = formData.name.trim() && formData.slug.length >= 3 && slugStatus === 'available';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="workspace-name">Workspace Name</Label>
        <Input
          id="workspace-name"
          type="text"
          placeholder="Marketing Team"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>

      <SlugInput
        value={formData.slug}
        onChange={(slug) => handleSlugChange(slug)}
        onStatusChange={setSlugStatus}
      />

      <div className="flex justify-between gap-4 pt-4">
        {showCancel && onCancel && (
          <Button 
            type="button" 
            onClick={onCancel}
            variant="outline"
            size="lg"
          >
            {cancelText}
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={loading || !isFormValid}
          size="lg"
          className="font-semibold"
        >
          {loading ? 'Creating...' : submitText}
        </Button>
      </div>
    </form>
  );
};