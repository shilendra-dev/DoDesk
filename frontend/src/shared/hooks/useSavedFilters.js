import { useContext } from 'react';
import { SavedFilterContext } from '../../providers/SavedFilterContext';

export const useSavedFilters = () => {
    const context = useContext(SavedFilterContext);
    if (!context) {
        throw new Error("useSavedFilters must be used within a SavedFilterProvider");
    }
    return context;
};