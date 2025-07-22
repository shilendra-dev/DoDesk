const prisma = require('../lib/prisma');

// Checks if user is admin in any team of the workspace
const requireWorkspaceAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const { workspace_id } = req.params;

  // Find if user is admin in any team in the workspace
  const isAdmin = await prisma.teamMember.findFirst({
    where: {
      userId,
      role: 'admin',
      team: { workspaceId: workspace_id }
    }
  });

  if (!isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { requireWorkspaceAdmin };