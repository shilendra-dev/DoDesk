import type { SavedFilter } from '@prisma/client';

export interface CreateSavedFilterRequest {
  name: string;
  filters: any; // JSON object
  isDefault?: boolean;
}

export interface CreateSavedFilterResponse {
  filter: SavedFilter;
}

export interface GetSavedFiltersResponse {
  filters: SavedFilter[];
}

export interface UpdateSavedFilterRequest {
  name?: string;
  filters?: any; // JSON object
  isDefault?: boolean;
}

export interface UpdateSavedFilterResponse {
  filter: SavedFilter;
}