"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/organisms/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/molecules/form"
import { Mail, CheckCircle, XCircle } from "lucide-react"
import { useWorkspaceStore } from "@/stores/workspaceStore"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

// Type for API error response
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

export const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [inviteStatus, setInviteStatus] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' })
  
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const fetchMembers = useWorkspaceStore((state) => state.fetchMembers)

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset()
      setInviteStatus({ type: '', message: '' })
    }
  }, [isOpen, form])

  const onSubmit = async (data: InviteMemberFormData) => {
    if (!currentWorkspace) {
      toast.error("No workspace selected")
      return
    }

    setIsLoading(true)
    setInviteStatus({ type: '', message: '' })

    try {
      const response = await api.post(`/api/workspace/${currentWorkspace.id}/invite`, {
        email: data.email.trim().toLowerCase(),
      })

      if (response.status === 200 || response.status === 201) {
        setInviteStatus({
          type: 'success',
          message: `Invitation sent to ${data.email}!`
        })
        
        // Refresh members list
        await fetchMembers()
        
        // Reset form
        form.reset()
        
        // Close dialog after a short delay
        setTimeout(() => {
          onClose()
          setInviteStatus({ type: '', message: '' })
        }, 2000)
      } else {
        throw new Error("Failed to send invitation")
      }
    } catch (error: unknown) {
      console.error("Failed to invite member:", error)
      
      // Show specific error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'response' in error
        ? (error as ApiError).response?.data?.message || "Failed to send invitation"
        : "Failed to send invitation"
      
      setInviteStatus({
        type: 'error',
        message: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setInviteStatus({ type: '', message: '' })
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite someone to join your workspace and collaborate on projects.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="colleague@company.com" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {inviteStatus.message && (
              <div className={`p-4 rounded-md border ${
                inviteStatus.type === 'success' 
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              }`}>
                <div className="flex items-center gap-2 text-sm">
                  {inviteStatus.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className={
                    inviteStatus.type === 'success' 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                  }>
                    {inviteStatus.message}
                  </span>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}