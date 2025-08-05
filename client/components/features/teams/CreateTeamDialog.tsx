"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Textarea } from "@/components/ui/atoms/textarea"
import { Label } from "@/components/ui/atoms/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/organisms/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/molecules/form"
import { Plus } from "lucide-react"
import { useWorkspaceStore } from "@/stores/workspaceStore"
import api from "@/lib/axios"

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(50, "Team name must be less than 50 characters"),
  key: z.string().min(1, "Team key is required").max(10, "Team key must be less than 10 characters").regex(/^[A-Z0-9]+$/, "Team key must be uppercase letters and numbers only"),
  description: z.string().optional(),
  color: z.string().default("#3B82F6"),
})

type CreateTeamFormData = z.infer<typeof createTeamSchema>

interface CreateTeamDialogProps {
  onTeamCreated?: () => void
}

export function CreateTeamDialog({ onTeamCreated }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const fetchTeams = useWorkspaceStore((state) => state.fetchTeams)

  const form = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      color: "#3B82F6",
    },
  })

  const onSubmit = async (data: CreateTeamFormData) => {
    if (!currentWorkspace) return

    setIsLoading(true)
    try {
      await api.post(`/api/workspace/${currentWorkspace.id}/teams`, {
        name: data.name,
        key: data.key,
        description: data.description,
        color: data.color,
      })

      // Refresh teams list
      await fetchTeams()
      
      // Close dialog and reset form
      setOpen(false)
      form.reset()
      
      // Call callback if provided
      onTeamCreated?.()
    } catch (error) {
      console.error("Failed to create team:", error)
      // You might want to show an error toast here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus size={16} />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team to organize your work and collaborate with others.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Key</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="TEAM" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this team does..."
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="color" 
                        className="w-16 h-10 p-1"
                        {...field} 
                      />
                      <Input 
                        placeholder="#3B82F6" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Team"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 