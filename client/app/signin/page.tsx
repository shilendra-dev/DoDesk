import { SignInForm } from '@/components/features/auth/SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  )
}