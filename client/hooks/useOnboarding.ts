'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserData {
  name: string;
  workspace: unknown;
}

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    workspace: null
  });
  const { data: session } = useSession();

  useEffect(() => {
    // Load user data from auth context
    if (session?.user) {
      setUserData(prev => ({
        ...prev,
        name: session.user.name || 'there'
      }));
    }
  }, [session]);

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({
      ...prev,
      ...data
    }));
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    userData,
    updateUserData
  };
};