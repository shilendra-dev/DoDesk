'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Step {
  id: string;
  component: React.ReactNode;
}

interface OnboardingCarouselProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
}

const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ 
  steps, 
  currentStep, 
}) => {
  const router = useRouter();

  const fadeVariants = {
    enter: {
      opacity: 0
    },
    center: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5 pointer-events-none" />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <button 
        className="fixed top-4 left-4 cursor-pointer backdrop-blur-md p-2 text-foreground hover:text-muted-foreground text-lg font-medium z-50 transition-colors duration-200"
        onClick={() => router.push('/')}
      >
        <X size={16} />
      </button>

      {/* Step Counter */}
      <div className="fixed top-4 right-4 bg-card/90 backdrop-blur-md px-4 py-2 rounded-full text-foreground text-sm font-medium z-50 border border-border">
        <span className="font-bold">{currentStep + 1}</span>
        <span className="text-muted-foreground"> of </span>
        <span>{steps.length}</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {steps[currentStep]?.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Dots (non-clickable) */}
      <div className="flex justify-center gap-2 pb-8 relative z-10">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? 'bg-primary' 
                : index < currentStep 
                  ? 'bg-primary/70' 
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default OnboardingCarousel;