'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/molecules/card';
import { WorkspaceForm } from '@/components/ui/organisms/WorkspaceForm';

interface CreateWorkspaceScreenProps {
  onWorkspaceCreate: (workspace: unknown) => void;
  onPrev: () => void;
}

const CreateWorkspaceScreen: React.FC<CreateWorkspaceScreenProps> = ({ 
  onWorkspaceCreate, 
  onPrev 
}) => {
  return (
    <motion.div 
      className="flex items-center justify-center min-h-[80vh] px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md mx-auto">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl font-bold mb-1 text-foreground text-nowrap">Create your first workspace</div>
              <p className="text-sm text-muted-foreground font-normal">This will be your team&apos;s base</p>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <WorkspaceForm
              onSuccess={onWorkspaceCreate}
              onCancel={onPrev}
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CreateWorkspaceScreen;