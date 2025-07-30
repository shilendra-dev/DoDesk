'use client'

import { useState } from 'react'
import { requestPasswordReset } from '@/lib/auth-client'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import Link from 'next/link'
import { useTheme } from '@/providers/ThemeContext'
import Image from 'next/image'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')
  const { theme } = useTheme()

  // Validation states
  const isEmailValid = EMAIL_REGEX.test(email)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isEmailValid) {
      setError('Please enter a valid email address.')
      setIsLoading(false)
      return
    }

    try {
      if (typeof requestPasswordReset !== 'function') {
        throw new Error('requestPasswordReset function is not available')
      }

      const result = await requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/resetPassword`,
      })

      if (result.error) {
        console.error('Password reset error:', result.error)
        setError(getErrorMessage(result.error.message || result.error.toString()))
        return
      }
      
      setIsEmailSent(true)
    } catch (err: unknown) {
      setError(getErrorMessage(err instanceof Error ? err.message : 'Failed to send reset email'))
    } finally {
      setIsLoading(false)
    }
  }

  // Email sent success view
  if (isEmailSent) {
    return (
      <div className="w-full max-w-sm mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We sent a password reset link to your email address
          </p>
        </div>

        {/* Email Display */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Reset email sent to:</p>
          <p className="font-medium text-sm">{email}</p>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          Click the link in your email to reset your password. The link will expire in 1 hour.
        </p>
        
        <div className="pt-4 border-t border-border/50">
          <Link 
            href="/signin" 
            className="text-primary hover:underline font-medium transition-colors text-sm"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  // Main form
  return (
    <div className="w-80 max-w-sm mx-auto text-center space-y-8">
      {/* DoDesk Logo */}
      <div className="space-y-2">
        <div className="flex items-center justify-center flex-col">
          <Image
            src={theme === 'dark' ? '/logos/dodesk_white_logo.png' : '/logos/dodesk_black_logo.png'}
            alt="DoDesk"
            width={150}
            height={40}
            className="h-14 w-auto"
          />
          <p className="text-sm text-muted-foreground font-light tracking-wider">Reset Password</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleInputChange}
            disabled={isLoading}
            autoComplete="email"
            required
            className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>

        {error && (
          <div className="bg-destructive/5 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 font-medium" 
          disabled={isLoading || !isEmailValid}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending reset link...
            </div>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link 
          href="/signin" 
          className="text-primary hover:underline font-medium transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}

// Enhanced error mapping function
function getErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    'User not found': 'No account found with this email address.',
    'Invalid email': 'Please enter a valid email address.',
    'Network Error': 'Unable to connect to the server. Please check your internet connection.',
    'Too many requests': 'Too many reset attempts. Please wait a moment before trying again.',
    'requestPasswordReset function is not available': 'Password reset feature is not available. Please contact support.',
  }

  if (errorMap[error]) {
    return errorMap[error]
  }

  for (const [key, message] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return message
    }
  }

  return 'Something went wrong. Please try again.'
}