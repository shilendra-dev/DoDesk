'use client'

import { useState } from 'react'
import { signUp, signIn } from '@/lib/auth-client'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import Link from 'next/link'
import { ResendVerification } from './ResendVerification'
import { useTheme } from '@/providers/ThemeContext'
import Image from 'next/image'
import { GoogleSignInButton } from '@/components/ui/atoms/GoogleSignInButton'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [needVerification, setNeedVerification] = useState(false)
  const [error, setError] = useState('')
  const [_touched, setTouched] = useState({ name: false, email: false, password: false })
  const { theme } = useTheme()

  // Validation states
  const isEmailValid = EMAIL_REGEX.test(email)
  const isNameValid = name.trim().length >= 2
  const isPasswordValid = password.length >= 8

  const handleInputChange = (field: 'name' | 'email' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    if (field === 'name') setName(value)
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleInputBlur = (field: 'name' | 'email' | 'password') => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Enhanced validation
    if (!isNameValid) {
      setError('Name must be at least 2 characters long.')
      setIsLoading(false)
      return
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address.')
      setIsLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError('Password must be at least 8 characters long.')
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp.email({
        email,
        password,
        name: name.trim(),
        callbackURL: `${window.location.origin}/auth/callback`,
      })

      if (result.error) {
        setError(getErrorMessage(result.error.message || result.error.toString()))
        return
      }
      
      setNeedVerification(true)
    } catch (err: unknown) {
      console.error('Sign up error:', err)
      setError(getErrorMessage(err instanceof Error ? err.message : 'Registration failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    setError('')
    
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/callback`,
      });
      
      if (result.error) {
        setError(getErrorMessage(result.error.message || result.error.toString()))
      }
      // Note: If successful, the user will be redirected to Google OAuth
      // and then to the callback page, so we don't need to reset loading here
    } catch (err: unknown) {
      setError(getErrorMessage(err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsGoogleLoading(false)
    }
  };

  // Verification success view
  if (needVerification) {
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
          <h1 className="text-2xl font-semibold tracking-tight">Account Created Successfully!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your account has been created. Please verify your email to complete the registration and start using DoDesk.
          </p>
        </div>

        {/* Email Display */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Verification email sent to:</p>
          <p className="font-medium text-sm">{email}</p>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Next steps:</strong>
          </p>
          <div className="text-left space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</span>
              <span>Check your email inbox (and spam folder)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
              <span>Click the verification link in the email</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
              <span>Sign in to your new DoDesk account</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <ResendVerification email={email} />
          
          <div className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button 
              onClick={() => setNeedVerification(false)}
              className="text-primary hover:underline font-medium transition-colors"
            >
              try again
            </button>
          </div>
        </div>
        
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

  // Main signup form
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
          <p className="text-sm text-muted-foreground font-light tracking-wider">Create Account</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={handleInputChange('name')}
            onBlur={handleInputBlur('name')}
            disabled={isLoading}
            autoComplete="name"
            required
            className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={handleInputChange('email')}
            onBlur={handleInputBlur('email')}
            required
            disabled={isLoading}
            autoComplete="email"
            className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />
          
          <Input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={handleInputChange('password')}
            onBlur={handleInputBlur('password')}
            required
            disabled={isLoading}
            autoComplete="new-password"
            minLength={8}
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
          disabled={isLoading || !isEmailValid || !isPasswordValid || !isNameValid}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </div>
          ) : (
            'Create account'
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleSignInButton 
          onClick={handleGoogleSignUp}
          isLoading={isGoogleLoading}
          variant="signup"
        />
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
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
    'Credential account not found': 'No account found with this email address.',
    'Password is too short': 'Password must be at least 8 characters long.',
    'Invalid credentials': 'Invalid email or password. Please try again.',
    'Provider not found': 'Google sign-in is not available at the moment.',
    'Email already exists': 'An account with this email already exists. Please sign in instead.',
    'Invalid email': 'Please enter a valid email address.',
    'Network Error': 'Unable to connect to the server. Please check your internet connection.',
    'User already exists': 'An account with this email already exists. Please sign in instead.',
    'Invalid password': 'Password must be at least 8 characters long.',
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