'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/atoms/button';
import { Card, CardContent } from '@/components/ui/molecules/card';
import { Zap, Target, Users } from 'lucide-react';

interface WelcomeScreenProps {
  userName: string;
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userName, onNext }) => {

  return (
    <motion.div 
      className="flex items-center justify-center min-h-[80vh] px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto text-center">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl font-bold mb-2 text-foreground text-wrap"
        >
          Welcome to DoDesk <br />
          <span className="text-primary">{userName}!</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-lg text-muted-foreground mb-7"
        >
          Let&apos;s get you set up in under 2 minutes
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7"
        >
          {[
            { icon: <Zap size={35} />, text: "Lightning fast" },
            { icon: <Target size={35} />, text: "Stay focused" },
            { icon: <Users size={35} />, text: "Collaboration" }
          ].map((feature, index) => (
            <Card key={index} className="p-4 text-center border-border/50 hover:border-border/70 hover:scale-110 duration-200">
              <CardContent className="p-0">
                <div className="flex items-center justify-center mb-4">{feature.icon}</div>
                <div className="text-md text-muted-foreground">{feature.text}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button 
            onClick={onNext}
            size="lg"
            className="font-semibold"
          >
            Get Started →
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;