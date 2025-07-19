'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/molecules/card';
import { Button } from '@/components/ui/atoms/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface CompleteScreenProps {
  name: string;
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  onComplete: () => void;
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({ name, workspace, onComplete }) => {
  return (
    <motion.div 
      className="flex items-center justify-center min-h-[80vh] px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md mx-auto">
        <Card className="border-border/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Welcome to {workspace.name}, {name}! ��
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your workspace is ready. Let&apos;s start managing your tasks and collaborating with your team.
            </p>
          </CardHeader>
          
          <CardContent className="text-center">
            <Button 
              onClick={onComplete}
              size="lg"
              className="w-full group"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CompleteScreen;