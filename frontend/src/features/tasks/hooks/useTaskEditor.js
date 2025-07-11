import React, { useState, useEffect, useRef } from "react";
import { useTaskContext } from "../../../providers/TaskContext";
import TaskService from "../services/taskService";

const useTaskEditor = (initialTask) => {
  const taskContext = useTaskContext();
  const taskService = new TaskService(taskContext);
  
  // Task state
  const [editedTask, setEditedTask] = useState(initialTask);
  const [notes, setNotes] = useState((initialTask && initialTask.notes) || "");
  
  // Badge dropdown state
  const [dropdownType, setDropdownType] = useState(null);
  const statusDropdownRef = useRef(null);
  const priorityDropdownRef = useRef(null);
  
  // Assignee management state
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [dropdownMembers, setDropdownMembers] = useState([]);
  const [newlyAddedAssigneeIds, setNewlyAddedAssigneeIds] = useState([]);

  // Auto-close badge dropdown on outside click
  useEffect(() => {
    if (!dropdownType) return;
    const handleClick = (e) => {
      const currentRef = dropdownType === "status" ? statusDropdownRef : priorityDropdownRef;
      if (currentRef.current && !currentRef.current.contains(e.target)) {
        setDropdownType(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownType]);

  // Reset state when task changes
  useEffect(() => {
    setEditedTask(initialTask);
    setNotes(initialTask?.notes || "");
    setNewlyAddedAssigneeIds([]);
  }, [initialTask]);

  // Auto-save field changes
  const handleAutoSaveChange = async (e) => {
    const { name, value } = e.target;
    const updated = { ...editedTask, [name]: value };
    setEditedTask(updated);
    await taskService.updateTaskField(editedTask, name, value);
  };

  // Handle badge dropdown selections (status/priority)
  const handleBadgeSelect = async (type, value) => {
    console.log(`Updating ${type} to ${value}`);
    
    const updated = { ...editedTask, [type]: value };
    setEditedTask(updated);
    setDropdownType(null);
    await taskService.updateTaskField(editedTask, type, value);
  };

  // Handle notes updates
  const handleNotesUpdate = async (newNotes) => {
    setNotes(newNotes);
    console.log("Updating notes:", newNotes);
    await taskService.updateTaskNotes(initialTask.id, newNotes);
  };

  // Handle task assignment
  const handleAssign = async (taskId, assigneeIds) => {
    
      const result = await taskService.assignMembersToTask(editedTask, assigneeIds);
      
      if (result.updatedTask) {
        setEditedTask(result.updatedTask);
      }

      setNewlyAddedAssigneeIds(result.assigneeIds);
      setShowAssigneeDropdown(false);
      return result;
  };

  // Handle assignee removal
  const handleRemoveAssignee = async (userId) => {
      const updatedTask = await taskService.removeAssigneeFromTask(editedTask, userId);
      setEditedTask(updatedTask);
      return updatedTask;
  };

  // Toggle assignee dropdown and fetch available members
  const handleAssigneeDropdownToggle = async () => {
    try {
      const unassignedMembers = await taskService.getAvailableMembers(
        initialTask.workspace_id,
        editedTask.assignees
      );
      setDropdownMembers(unassignedMembers);
      setShowAssigneeDropdown((prev) => !prev);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  return {
    // State
    editedTask,
    notes,
    dropdownType,
    showAssigneeDropdown,
    dropdownMembers,
    newlyAddedAssigneeIds,
    
    // Refs
    statusDropdownRef,
    priorityDropdownRef,
    
    // Handlers
    handleAutoSaveChange,
    handleBadgeSelect,
    handleNotesUpdate,
    handleAssign,
    handleRemoveAssignee,
    handleAssigneeDropdownToggle,
    
    // State setters (for direct control if needed)
    setDropdownType,
    setShowAssigneeDropdown,
  };
};

export default useTaskEditor;