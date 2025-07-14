'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/atoms/button';
import { Input } from '@/components/ui/atoms/input';
import { Label } from '@/components/ui/atoms/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/molecules/card';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/axios';

interface InviteTeamScreenProps {
  workspace: unknown;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

const InviteTeamScreen: React.FC<InviteTeamScreenProps> = ({ 
  workspace, 
  onNext, 
  onPrev, 
  onSkip 
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

  const handleInvite = async () => {
    if (!email.trim()) {
      onNext();
      return;
    }

    setLoading(true);
    setInviteStatus({ type: '', message: '' });

    try {
      const workspaceData = workspace as { id: string };
      
      const response = await api.post(
        `/workspace/${workspaceData.id}/invite`,
        { email: email.trim() }
      );
      
      if (response.status === 200 || response.status === 201) {
        setInviteStatus({
          type: 'success',
          message: `Invitation sent to ${email}!`
        });
      } else {
        setInviteStatus({
          type: 'error',
          message: 'Failed to send invitation'
        });
      }
      
      setTimeout(() => {
        onNext();
      }, 2000);
      
    } catch (error: unknown) {
      console.error('Error inviting team member:', error);
      setInviteStatus({
        type: 'error',
        message: 'Error sending invitation'
      });
    } finally {
      setLoading(false);
    }
  };

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
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2 text-foreground">Invite a Team Member</div>
              <p className="text-lg text-muted-foreground font-normal">Add your first team member to collaborate</p>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="team-email">Team Member Email</Label>
                <Input
                  id="team-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@company.com"
                />
              </div>

              {inviteStatus.message && (
                <Card className={`p-4 border ${
                  inviteStatus.type === 'success' 
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                }`}>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-2 text-sm">
                      {inviteStatus.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                      <span className={
                        inviteStatus.type === 'success' 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-red-700 dark:text-red-300'
                      }>
                        {inviteStatus.message}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between gap-4 pt-4">
                <Button
                  onClick={onPrev}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                >
                  Back
                </Button>
                
                <Button
                  onClick={onSkip}
                  disabled={loading}
                  variant="ghost"
                  size="lg"
                >
                  Skip for now
                </Button>
                
                <Button
                  onClick={handleInvite}
                  disabled={loading}
                  size="lg"
                  className="font-semibold"
                >
                  {loading ? 'Sending...' : 'Send Invite'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default InviteTeamScreen;