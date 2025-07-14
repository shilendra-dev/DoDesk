'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import { Label } from '@/components/ui/atoms/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/molecules/card'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get callback URL from search params (for redirects after login)
  const callbackUrl = searchParams.get('callbackUrl')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Attempt to sign in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Don't redirect automatically
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        // Login successful - get fresh session data
        const session = await getSession()
        
        console.log('🔍 Session after login:', session)
        
        // Check if user has a workspace
        if (session?.user?.default_workspace_id) {
          console.log('✅ User has workspace, redirecting to:', callbackUrl || '/dashboard')
          // User has workspace - redirect to callback URL or dashboard
          router.push(callbackUrl || '/dashboard')
        } else {
          console.log('⚠️ User has no workspace, redirecting to onboarding')
          // User has no workspace - redirect to onboarding
          router.push('/onboarding')
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign in to DoDesk</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your workspace
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email || !password}
            size="lg"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>

        {/* Show callback info for debugging */}
        {callbackUrl && (
          <div className="text-xs text-muted-foreground text-center mt-2">
            You&apos;ll be redirected back to your previous page after signing in
          </div>
        )}
      </CardContent>
    </Card>
  )
}