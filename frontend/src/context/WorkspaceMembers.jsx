import React, {createContext, useContext, useEffect, useState} from "react";
import { getAllWorkspaceMembers } from "../api/workspace";
import { useWorkspace } from "./WorkspaceContext";

const WorkspaceMembersContext = createContext();

export const WorkspaceMembersProvider = ({ children }) => {
    const {selectedWorkspace} = useWorkspace();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchMembers = async () => {
            if(!selectedWorkspace) return ;
            setLoading(true);
            try{
                const data = await getAllWorkspaceMembers(selectedWorkspace.id);
                console.log("allMembers: ", data)
                setMembers(data);
            }catch(error){
                console.error("Failed to fetch workspace members: ", error);
            }finally{
                setLoading(false);
            }
        };
        fetchMembers();
    },[selectedWorkspace])

    return (
        <WorkspaceMembersContext.Provider value = {{members, loading}}>
            {children}
        </WorkspaceMembersContext.Provider>
    )
}

export const useWorkspaceMembers = () => useContext(WorkspaceMembersContext)