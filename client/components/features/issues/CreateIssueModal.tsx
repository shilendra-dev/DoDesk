"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { Textarea } from "@/components/ui/atoms/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/organisms/dialog";

import { CreateIssueData } from "@/types/issue";
import { useIssueStore } from "@/stores/issueStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";

import { AssigneeSelect } from "@/components/ui/molecules/AssigneeSelect";
import { DueDatePicker } from "@/components/ui/molecules/DueDatePicker";

import {
  Users,
  Flag,
  Calendar,
  CheckSquare,
  FileText,
  UserCheck,
} from "lucide-react";

interface CreateIssueModalProps {
  workspaceId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateIssueModal({
  workspaceId,
  isOpen,
  onClose,
}: CreateIssueModalProps) {
  const { createIssue } = useIssueStore();
  const { teams, members } = useWorkspaceStore();

  const [formData, setFormData] = useState<CreateIssueData>({
    title: "",
    description: "",
    state: "backlog",
    priority: 0,
    workspaceId: workspaceId ?? "",
    teamId: teams[0]?.id ?? "",
    assigneeId: null,
    dueDate: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update default selected team
  useEffect(() => {
    if (teams.length > 0 && !formData.teamId) {
      setFormData((prev) => ({ ...prev, teamId: teams[0].id }));
    }
  }, [teams, formData.teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!workspaceId || !formData.title.trim() || !formData.teamId) {
      setError("Title and Team are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createIssue(formData);
      onClose();
      setFormData({
        title: "",
        description: "",
        state: "backlog",
        priority: 0,
        workspaceId: workspaceId ?? "",
        teamId: teams[0]?.id ?? "",
      });
    } catch (err) {
      setError("Error creating issue.");
      console.error("Error creating issue:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateIssueData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-lg">
        {/* Header */}
        <DialogHeader className="bg-primary/5 px-6 py-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
            <FileText className="w-6 h-6 text-primary" />
            Create New Issue
          </DialogTitle>
        </DialogHeader>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-2">
          {/* Title & Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter issue title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team" className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                Team *
              </Label>
              <Select
                value={formData.teamId}
                onValueChange={(value) => handleInputChange("teamId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
              placeholder="Describe the issue in detail"
            />
          </div>

          {/* Assignee, Date, Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="assignee" className="flex items-center gap-2 text-sm">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
                Assignee
              </Label>
              <AssigneeSelect
                members={members}
                value={formData.assigneeId ?? ""}
                onChange={(assigneeId) =>
                  setFormData((prev) => ({
                    ...prev,
                    assigneeId: assigneeId ?? "",
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="flex items-center gap-2 text-sm">
                <Flag className="w-4 h-4 text-muted-foreground" />
                Priority
              </Label>
              <Select
                value={formData.priority?.toString() ?? "0"}
                onValueChange={(value) =>
                  handleInputChange("priority", Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Urgent</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                  <SelectItem value="3">Medium</SelectItem>
                  <SelectItem value="4">Low</SelectItem>
                  <SelectItem value="0">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* State */}
          <div className="space-y-2 md:max-w-sm">
            <Label htmlFor="state" className="flex items-center gap-2 text-sm">
              <CheckSquare className="w-4 h-4 text-muted-foreground" />
              State
            </Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleInputChange("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          </div>

          {/* Due Date */}
          <div className="space-y-2 md:max-w-sm">
              <Label className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Due Date
              </Label>
              <DueDatePicker
                value={formData.dueDate}
                onChange={(dueDate) =>
                  setFormData((prev) => ({ ...prev, dueDate }))
                }
              />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || !formData.title.trim() || !formData.teamId
              }
            >
              {isSubmitting ? "Creating..." : "Create Issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
