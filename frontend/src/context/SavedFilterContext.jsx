import React, { createContext, useState, useCallback } from 'react';
import {
    getSavedFilters,
    getDefaultFilter,
    saveFilter,
    deleteFilter,
    setDefaultFilter as setDefaultFilterApi
} from '../api/savedFilterApi';

export const SavedFilterContext = createContext(null);

export const SavedFilterProvider = ({ children }) => {
    const [savedFilters, setSavedFilters] = useState([]);
    const [defaultFilter, setDefaultFilter] = useState(null);
    const [selectedViewId, setSelectedViewId] = useState('none');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSavedFilters = useCallback(async (workspaceId) => {
        try {
            setLoading(true);
            const filters = await getSavedFilters(workspaceId);
            setSavedFilters(filters);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching saved filters:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDefaultFilter = useCallback(async (workspaceId) => {
        try {
            setLoading(true);
            const filter = await getDefaultFilter(workspaceId);
            if (filter) {
                setDefaultFilter(filter);
                setSelectedViewId(filter.id);
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching default filter:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createFilter = useCallback(async (workspaceId, filterData) => {
        try {
            setLoading(true);
            const newFilter = await saveFilter(workspaceId, filterData);
            setSavedFilters(prev => [...prev, newFilter]);
            setSelectedViewId(newFilter.id);
            await setDefaultFilterApi(workspaceId, newFilter.id);
            setDefaultFilter(newFilter);
            setError(null);
            return newFilter;
        } catch (err) {
            setError(err.message);
            console.error('Error creating filter:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeFilter = useCallback(async (workspaceId, filterId) => {
        try {
            setLoading(true);
            await deleteFilter(workspaceId, filterId);
            setSavedFilters(prev => prev.filter(f => f.id !== filterId));
            if (defaultFilter?.id === filterId) {
                setDefaultFilter(null);
                setSelectedViewId('none');
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error removing filter:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [defaultFilter]);

    const makeDefault = useCallback(async (workspaceId, filterId) => {
        try {
            setLoading(true);
            const updatedFilter = await setDefaultFilterApi(workspaceId, filterId);
            setDefaultFilter(updatedFilter);
            setSelectedViewId(filterId);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error setting default filter:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSelectedView = useCallback(() => {
        setSelectedViewId('none');
    }, []);

    const value = {
        savedFilters,
        defaultFilter,
        selectedViewId,
        loading,
        error,
        fetchSavedFilters,
        fetchDefaultFilter,
        createFilter,
        removeFilter,
        makeDefault,
        clearSelectedView
    };

    return (
        <SavedFilterContext.Provider value={value}>
            {children}
        </SavedFilterContext.Provider>
    );
}; 