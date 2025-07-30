'use client'

import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm'

function ResetPasswordFormWrapper() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ResetPasswordForm />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm mx-auto text-center space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordFormWrapper />
    </Suspense>
  )
}