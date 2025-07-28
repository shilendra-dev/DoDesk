import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../types';

export const requireWorkspaceAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { workspace_id } = req.params;

  const isAdmin = await prisma.teamMember.findFirst({
    where: {
      userId,
      role: 'admin',
      team: { workspaceId: workspace_id || '' }
    }
  });

  if (!isAdmin) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  
  next();
};