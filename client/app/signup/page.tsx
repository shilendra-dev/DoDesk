import { SignUpForm } from '@/components/features/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  )
}