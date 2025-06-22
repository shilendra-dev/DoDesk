import axios from "axios";

//for getting all saved filters
export const getSavedFilters = async (workspaceId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5033/api/workspaces/${workspaceId}/filters`,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}

//for getting the default filter
export const getDefaultFilter = async (workspaceId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5033/api/workspaces/${workspaceId}/filters/default`,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}

//for saving a new filter
export const saveFilter = async (workspaceId, filterData) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`http://localhost:5033/api/workspaces/${workspaceId}/filters`, filterData,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}

//for deleting a filter 
export const deleteFilter = async (workspaceId, filterId) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`http://localhost:5033/api/workspaces/${workspaceId}/filters/${filterId}/remove`,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}

//for setting a filter as default   
export const setDefaultFilter = async (workspaceId, filterId) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`http://localhost:5033/api/workspaces/${workspaceId}/filters/${filterId}/default`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    return res.data;
}