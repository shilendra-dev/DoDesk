'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/atoms/button';
import Image from 'next/image';

interface IntroScreenProps {
  onNext: () => void;
  onPrev: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onNext, onPrev }) => {
  return (
    <motion.div 
      className="flex items-center justify-center min-h-[80vh] px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h3 className="text-4xl font-bold mb-2 text-foreground">
          Build for the best teams
        </h3>
        
        <p className="text-lg text-muted-foreground mb-6">
          Everything you need to plan, track, and ship great products
        </p>

        <div className="mb-8">
          <div className="relative mx-auto max-w-4xl">
            <div className="group">
              <Image
                src="/DashboardScreenshot.png"
                alt="DoDesk Dashboard Preview"
                width={1200}
                height={800}
                className="rounded-lg shadow-2xl transition-all duration-600 border border-border group-hover:scale-110 group-hover:shadow-3xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            onClick={onPrev}
            variant="outline"
            size="lg"
          >
            Back
          </Button>
          <Button 
            onClick={onNext}
            size="lg"
            className="font-semibold"
          >
            Continue →
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroScreen;