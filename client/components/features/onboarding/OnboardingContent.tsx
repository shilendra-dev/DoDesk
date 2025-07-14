'use client';

import React from 'react';
import { Session } from 'next-auth';
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

export default function OnboardingContent({ session }: OnboardingContentProps) {
  const { currentStep, nextStep, prevStep, userData, updateUserData } = useOnboarding();

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
          onWorkspaceCreate={(workspaceData) => {
            updateUserData({ workspace: workspaceData });
            nextStep();
          }}
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
      component: <CompleteScreen name={session.user?.name || 'there'} />
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