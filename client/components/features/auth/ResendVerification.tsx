'use client'

import { useState } from 'react'
import { sendVerificationEmail } from '@/lib/auth-client'
import { Button } from '@/components/ui/atoms/button'
import { toast } from 'react-hot-toast'

interface ResendVerificationProps {
  email: string
}

export function ResendVerification({ email }: ResendVerificationProps) {
  const [isSending, setIsSending] = useState(false)

  const handleResend = async () => {
    setIsSending(true)
    try {
      await sendVerificationEmail({ 
        email,
        callbackURL: `${window.location.origin}/signin`
      })
      toast.success('Verification email sent!')
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to send verification email')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Button 
      onClick={handleResend}
      disabled={isSending}
      variant="outline"
      className="w-full"
    >
      {isSending ? 'Sending...' : 'Resend verification email'}
    </Button>
  )
}   