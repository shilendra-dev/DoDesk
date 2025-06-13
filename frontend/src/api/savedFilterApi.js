import axios from "axios";

const BASE_URL = "http://localhost:5033/api/saved-filters";


//for getting all saved filters
export const getSavedFilters = async (workspaceId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/${workspaceId}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}

//for getting the default filter
export const getDefaultFilter = async (workspaceId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/${workspaceId}/default`,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}

//for saving a new filter
export const saveFilter = async (workspaceId, filterData) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${BASE_URL}/${workspaceId}`, filterData,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}

//for deleting a filter 
export const deleteFilter = async (workspaceId, filterId) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${BASE_URL}/${workspaceId}/${filterId}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}

//for setting a filter as default   
export const setDefaultFilter = async (workspaceId, filterId) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/${workspaceId}/${filterId}/default`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}