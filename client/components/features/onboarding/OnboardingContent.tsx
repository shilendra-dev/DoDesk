// client/components/features/onboarding/OnboardingContent.tsx
'use client';

import React, { useEffect } from 'react';
import { Session } from 'next-auth';
import { useWorkspace } from '@/providers/WorkspaceContext'; // Add this import
import { useRouter } from 'next/navigation';
import OnboardingCarousel from './OnboardingCarousel';
import WelcomeScreen from './screens/WelcomeScreen';
import IntroScreen from './screens/IntroScreen';
import CreateWorkspaceScreen from './screens/CreateWorkspaceScreen';
import InviteTeamScreen from './screens/InviteTeamScreen';
import CompleteScreen from './screens/CompleteScreen';
import { useOnboarding } from '@/hooks/useOnboarding';

interface OnboardingContentProps {
  session: Session;
}
interface WorkspaceData {
  id: string
  name: string
  slug: string
}

export default function OnboardingContent({ session }: OnboardingContentProps) {
  const { currentStep, nextStep, prevStep, userData, updateUserData } = useOnboarding();
  const { addWorkspace, hasWorkspaces, getDefaultWorkspace, isLoading } = useWorkspace();
  const router = useRouter();

  // Redirect users who already have workspaces
  useEffect(() => {
    if (!isLoading && hasWorkspaces) {
      const defaultWorkspace = getDefaultWorkspace();
      if (defaultWorkspace) {
        router.replace(`/${defaultWorkspace.slug}/myissues`);
      }
    }
  }, [isLoading, hasWorkspaces, getDefaultWorkspace, router]);

  // 🆕 Handle workspace creation with context update
  const handleWorkspaceCreate = (workspaceData: unknown) => {
    const workspace = workspaceData as WorkspaceData;
    console.log('🎯 Workspace created:', workspaceData);
    
    // Update onboarding context
    updateUserData({ workspace: workspace });
    
    // 🆕 Update workspace context immediately
    addWorkspace({
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug
    });
    
    console.log('✅ Workspace context updated');
    nextStep();
  };

  const steps = [
    {
      id: 'welcome',
      component: <WelcomeScreen userName={session.user?.name || 'there'} onNext={nextStep} />
    },
    {
      id: 'intro',
      component: <IntroScreen onNext={nextStep} onPrev={prevStep} />
    },
    {
      id: 'create-workspace',
      component: (
        <CreateWorkspaceScreen 
          onWorkspaceCreate={handleWorkspaceCreate} // Use updated handler
          onPrev={prevStep}
        />
      )
    },
    {
      id: 'invite-team',
      component: (
        <InviteTeamScreen 
          workspace={userData.workspace}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={nextStep}
        />
      )
    },
    {
      id: 'complete',
      component: <CompleteScreen name={session.user?.name || 'there'} workspace={userData.workspace as WorkspaceData} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <OnboardingCarousel
        steps={steps}
        currentStep={currentStep}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </div>
  );
}