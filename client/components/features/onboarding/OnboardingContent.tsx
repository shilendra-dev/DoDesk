'use client';

import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useRouter } from 'next/navigation';
import OnboardingCarousel from './OnboardingCarousel';
import WelcomeScreen from './screens/WelcomeScreen';
import IntroScreen from './screens/IntroScreen';
import CreateWorkspaceScreen from './screens/CreateWorkspaceScreen';
import InviteTeamScreen from './screens/InviteTeamScreen';
import CompleteScreen from './screens/CompleteScreen';
import { useOnboarding } from '@/hooks/useOnboarding';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/providers/auth-provider';

interface WorkspaceData {
  id: string
  name: string
  slug: string
}

export default function OnboardingContent() {
  const { user } = useAuth();
  const { currentStep, nextStep, prevStep, userData, updateUserData } = useOnboarding();
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace);
  const hasWorkspaces = useWorkspaceStore((state) => state.hasWorkspaces);
  const lastActiveWorkspaceId = useWorkspaceStore((state) => state.lastActiveWorkspaceId);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const isLoading = useWorkspaceStore((state) => state.isLoading);
  const router = useRouter();

  // Local state for loading and error
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect users who already have workspaces
  useEffect(() => {
    if (!isLoading && hasWorkspaces) {
      const lastActiveWorkspace = workspaces.find(w => w.id === lastActiveWorkspaceId)
      if (lastActiveWorkspace) {
        router.replace(`/${lastActiveWorkspace.slug}/myissues`);
      } else if (workspaces.length > 0) {
        router.replace(`/${workspaces[0].slug}/myissues`);
      }
    }
  }, [isLoading, hasWorkspaces, lastActiveWorkspaceId, workspaces, router]);

  // Handle workspace creation with context update
  const handleWorkspaceCreate = async (workspaceData: unknown) => {
    setError(null);

    // Validate workspaceData
    const workspace = workspaceData as WorkspaceData;
    if (!workspace || !workspace.id || !workspace.name || !workspace.slug) {
      setError('Workspace data is invalid. Please try again.');
      toast.error('Workspace data is invalid. Please try again.');
      return;
    }

    // Prevent duplicate workspaces
    if (workspaces.some(w => w.slug === workspace.slug)) {
      setError('A workspace with this slug already exists.');
      toast.error('A workspace with this slug already exists.');
      return;
    }

    setCreating(true);
    try {
      await addWorkspace({
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        teams: []
      });

      // Wait for store to update (race condition prevention)
      const checkAdded = () => workspaces.some(w => w.id === workspace.id);
      let tries = 0;
      while (!checkAdded() && tries < 10) {
        await new Promise(res => setTimeout(res, 100));
        tries++;
      }

      updateUserData({ workspace: workspace });
      toast.success('Workspace created!');
      nextStep();
    } catch (err) {
      setError('Failed to create workspace. Please try again.');
      toast.error('Failed to create workspace. Please try again.');
      console.error('❌ Failed to create workspace:', err);
    } finally {
      setCreating(false);
    }
  };

  // Error boundary (optional, for the whole onboarding flow)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={() => setError(null)}
        >
          Try Again
        </button>
      </div>
    );
  }

  const steps = [
    {
      id: 'welcome',
      component: <WelcomeScreen userName={user?.name || 'there'} onNext={nextStep} />
    },
    {
      id: 'intro',
      component: <IntroScreen onNext={nextStep} onPrev={prevStep} />
    },
    {
      id: 'create-workspace',
      component: (
        <CreateWorkspaceScreen 
          onWorkspaceCreate={handleWorkspaceCreate}
          onPrev={prevStep}
          loading={creating}
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
      component: <CompleteScreen name={user?.name || 'there'} workspace={userData.workspace as WorkspaceData} />
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