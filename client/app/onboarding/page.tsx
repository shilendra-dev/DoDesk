import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OnboardingContent from "@/components/features/onboarding/OnboardingContent";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/signin?callbackUrl=/onboarding'); // Changed from /auth/login
  }

  return <OnboardingContent session={session} />;
}