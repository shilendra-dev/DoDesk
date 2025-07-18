'use client';

import { useState } from 'react'; 
import api from '@/lib/axios';

export const useWorkspaceOperations = () => {

  const [loading, setLoading] = useState(false);

  const createWorkspace = async (formData: { name: string; slug: string }) => {
    setLoading(true);
    try {
      const response = await api.post(
        `/api/workspace`, 
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    try {
      const response = await api.get(`/api/workspaces/check-slug/${slug}`);  // ✅ Fixed: Remove /api prefix
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    createWorkspace,
    checkSlugAvailability,
    loading
  };
};