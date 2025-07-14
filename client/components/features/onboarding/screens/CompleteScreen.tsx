'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/atoms/button';
import { Card, CardContent } from '@/components/ui/molecules/card';
import { PartyPopper, Lightbulb, Target, FileEdit } from 'lucide-react';

interface CompleteScreenProps {
  name: string;
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({ name }) => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const quickTips = [
    {
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      text: 'Use Cmd/Ctrl + K to quickly create new issues'
    },
    {
      icon: <Target className="w-5 h-5 text-yellow-500" />,
      text: 'Organize work with projects and milestones'
    },
    {
      icon: <FileEdit className="w-5 h-5 text-blue-500" />,
      text: 'Add detailed descriptions with rich text editor'
    }
  ];

  return (
    <motion.div 
      className="flex items-center justify-center min-h-[80vh] px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center items-center mb-6"
        >
          <PartyPopper className="w-16 h-16 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl font-bold mb-4 text-foreground"
        >
          You&apos;re all set, {name}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-xl text-muted-foreground mb-8"
        >
          Your workspace is ready to go!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 border-border/50">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Quick tips to get started:</h3>
              <div className="space-y-3">
                {quickTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                    className="flex items-center gap-3 text-left"
                  >
                    <span className="text-lg">{tip.icon}</span>
                    <span className="text-sm text-muted-foreground">{tip.text}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <Button 
            onClick={handleGoToDashboard}
            size="lg"
            className="font-semibold"
          >
            Go to Dashboard →
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompleteScreen;