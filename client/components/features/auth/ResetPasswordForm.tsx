'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/auth-client'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import Link from 'next/link'
import { useTheme } from '@/providers/ThemeContext'
import Image from 'next/image'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState(false)
  const searchParams = useSearchParams()
  const { theme } = useTheme()

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    const errorFromUrl = searchParams.get('error')
    
    if (errorFromUrl === 'INVALID_TOKEN') {
      setTokenError(true)
      setError('The reset link is invalid or has expired. Please request a new password reset.')
    } else if (!tokenFromUrl) {
      setTokenError(true)
      setError('No reset token found. Please use the link from your email.')
    } else {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  // Validation states
  const isPasswordValid = password.length >= 8
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0
  const isFormValid = isPasswordValid && isConfirmPasswordValid && token && !tokenError

  const handleInputChange = (field: 'password' | 'confirmPassword') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    if (field === 'password') setPassword(value)
    if (field === 'confirmPassword') setConfirmPassword(value)
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isPasswordValid) {
      setError('Password must be at least 8 characters long.')
      setIsLoading(false)
      return
    }

    if (!isConfirmPasswordValid) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    if (!token) {
      setError('No reset token found. Please use the link from your email.')
      setIsLoading(false)
      return
    }

    try {
      const result = await resetPassword({
        newPassword: password,
        token,
      })

      if (result.error) {
        setError(getErrorMessage(result.error.message || result.error.toString()))
        return
      }
      
      setIsSuccess(true)
    } catch (err: unknown) {
      console.error('Password reset error:', err)
      setError(getErrorMessage(err instanceof Error ? err.message : 'Failed to reset password'))
    } finally {
      setIsLoading(false)
    }
  }

  // Success view
  if (isSuccess) {
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
          <h1 className="text-2xl font-semibold tracking-tight">Password Reset Successfully!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
        
        <div className="pt-4 border-t border-border/50">
          <Link 
            href="/signin" 
            className="text-primary hover:underline font-medium transition-colors text-sm"
          >
            Continue to sign in
          </Link>
        </div>
      </div>
    )
  }

  // Token error view
  if (tokenError) {
    return (
      <div className="w-full max-w-sm mx-auto text-center space-y-8">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">Invalid Reset Link</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error}
          </p>
        </div>
        
        <div className="pt-4 border-t border-border/50">
          <Link 
            href="/auth/forgotPassword" 
            className="text-primary hover:underline font-medium transition-colors text-sm"
          >
            Request new reset link
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
          <p className="text-sm text-muted-foreground font-light tracking-wider">Set New Password</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New password (min 8 characters)"
            value={password}
            onChange={handleInputChange('password')}
            disabled={isLoading}
            autoComplete="new-password"
            required
            minLength={8}
            className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />
          
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            disabled={isLoading}
            autoComplete="new-password"
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
          disabled={isLoading || !isFormValid}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Resetting password...
            </div>
          ) : (
            'Reset password'
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
    'Invalid token': 'The reset link is invalid or has expired. Please request a new password reset.',
    'Token expired': 'The reset link has expired. Please request a new password reset.',
    'Password too short': 'Password must be at least 8 characters long.',
    'Network Error': 'Unable to connect to the server. Please check your internet connection.',
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