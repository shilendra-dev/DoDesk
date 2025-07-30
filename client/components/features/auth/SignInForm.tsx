'use client'

import { useState } from 'react'
import { signIn, sendVerificationEmail } from '@/lib/auth-client'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { toast } from 'react-hot-toast'
import { useTheme } from '@/providers/ThemeContext'
import Image from 'next/image'
import { GoogleSignInButton } from '@/components/ui/atoms/GoogleSignInButton'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [needVerification, setNeedVerification] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces)
  const { theme } = useTheme()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
  
    try {
      const result = await signIn.email({
        email,
        password,
      });
      
      if (result.error) {
        if (result.error.status === 403) {
          setNeedVerification(true)
          return
        }
        setError(getErrorMessage(result.error.message || result.error.toString()))
        return
      }
      
      // Successful sign in - now check workspace
      toast.success('Welcome back!')
      
      // Fetch user data and workspaces
      await fetchWorkspaces()
      
      // Get the current state after fetching
      const { lastActiveWorkspaceId, workspaces } = useWorkspaceStore.getState()
      
      // Check if user has lastActiveWorkspace
      if (lastActiveWorkspaceId) {
        // User has a workspace - go directly to dashboard
        const activeWorkspace = workspaces.find(w => w.id === lastActiveWorkspaceId)
        if (activeWorkspace) {
          router.replace(`/${activeWorkspace.slug}/myissues`)
          return
        }
      }
      
      // No lastActiveWorkspace - go to onboarding
      router.replace('/onboarding')
      
    } catch (err: unknown) {
      console.error('Sign in error:', err)
      setError(getErrorMessage(err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      await sendVerificationEmail({ 
        email,
        callbackURL: `${window.location.origin}/signin`
      })
      toast.success('Verification email sent!')
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to send verification email')
    } finally {
      setIsResending(false)
    }
  }

  const handleGoogleSignIn = async () => {
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
    } catch (err: unknown) {
      console.error('Google sign in error:', err)
      setError(getErrorMessage(err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsGoogleLoading(false)
    }
  };

  // Show verification required message
  if (needVerification) {
    return (
      <div className="w-full max-w-sm mx-auto text-center space-y-8">
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">Email verification required</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Please verify your email address before signing in
          </p>
        </div>

        {/* Email Display */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-amber-800 dark:text-amber-200 font-medium text-sm">
            Account found but email not verified:
          </p>
          <p className="text-amber-600 dark:text-amber-300 font-semibold">
            {email}
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          Check your email for a verification link, or request a new one below.
        </p>
        
        {/* Actions */}
        <div className="space-y-4">
          <Button 
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full h-12 font-medium"
            size="lg"
          >
            {isResending ? 'Sending...' : 'Resend verification email'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setNeedVerification(false)}
            className="w-full h-12 font-medium"
            size="lg"
          >
            Try different email
          </Button>
        </div>
        
        <div className="pt-4 border-t border-border/50 space-y-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="text-primary hover:underline font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Forgot your password?{' '}
            <Link 
              href="/auth/forgotPassword" 
              className="text-primary hover:underline font-medium transition-colors"
            >
              Reset it
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // Main signin form
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
          <p className="text-sm text-muted-foreground font-light tracking-wider">Sign-in</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
            className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors"
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
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
          disabled={isLoading || !email || !password}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </div>
          ) : (
            'Sign in'
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
        onClick={handleGoogleSignIn}
        isLoading={isGoogleLoading}
        variant="signin"
      />
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <div>
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            className="text-primary hover:underline font-medium transition-colors"
          >
            Sign up
          </Link>
        </div>
        <div>
          <Link 
            href="/auth/forgotPassword" 
            className="text-primary hover:underline font-medium transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}

// Enhanced error mapping function
function getErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    'Credential account not found': 'No account found with this email address. Please check your email or sign up.',
    'Password is too short': 'Password must be at least 8 characters long.',
    'Invalid credentials': 'Invalid email or password. Please try again.',
    'Provider not found': 'Google sign-in is not available at the moment.',
    'Email already exists': 'An account with this email already exists.',
    'Invalid email': 'Please enter a valid email address.',
    'Network Error': 'Unable to connect to the server. Please check your internet connection.',
    'User not found': 'No account found with this email address. Please sign up.',
    'Invalid password': 'Invalid email or password. Please try again.',
    'Account not found': 'No account found with this email address. Please sign up.',
  }

  // Check for exact matches first
  if (errorMap[error]) {
    return errorMap[error]
  }

  // Check for partial matches
  for (const [key, message] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return message
    }
  }

  return 'Something went wrong. Please try again.'
}