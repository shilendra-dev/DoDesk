"use client";

import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/organisms/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/molecules/form";

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
  Type,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateIssueData>({
    defaultValues: {
      title: "",
      description: "",
      state: "backlog",
      priority: 0,
      workspaceId: workspaceId ?? "",
      teamId: teams[0]?.id ?? "",
      assigneeId: null,
      dueDate: undefined,
    },
  });

  // Watch form values for validation
  const watchedTitle = useWatch({ control: form.control, name: "title" });
  const watchedTeamId = useWatch({ control: form.control, name: "teamId" });

  // Update default selected team
  useEffect(() => {
    if (teams.length > 0 && !form.getValues("teamId")) {
      form.setValue("teamId", teams[0].id);
    }
  }, [teams, form]);

  const onSubmit = async (data: CreateIssueData) => {
    setError(null);

    if (!workspaceId || !data.title.trim() || !data.teamId) {
      setError("Title and Team are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createIssue(data);
      onClose();
      form.reset();
    } catch (err) {
      setError("Error creating issue.");
      console.error("Error creating issue:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Create a new issue to track tasks, bugs, or feature requests for your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-muted-foreground" />
                    Title *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter issue title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Team */}
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Team *
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
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
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Assignee, Priority, State */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      Assignee
                    </FormLabel>
                    <FormControl>
                      <AssigneeSelect
                        members={members}
                        value={field.value ?? ""}
                        onChange={(assigneeId) => field.onChange(assigneeId)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-muted-foreground" />
                      Priority
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString() ?? "0"}
                        onValueChange={(value) => field.onChange(Number(value))}
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
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-muted-foreground" />
                      State
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Due Date
                  </FormLabel>
                  <FormControl>
                    <DueDatePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <DialogFooter>
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
                  isSubmitting || 
                  !watchedTitle?.trim() || 
                  !watchedTeamId?.trim()
                }
              >
                {isSubmitting ? "Creating..." : "Create Issue"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
