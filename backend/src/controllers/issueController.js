const prisma = require("../lib/prisma");
const { createApi } = require("../utils/router");

// Create issue
const createIssue = async (req, res) => {
  const {
    title,
    description,
    state = "backlog",
    priority = 0,
    labels = [],
    dueDate,
    teamId,
    assigneeId
  } = req.body;

  const creatorId = req.user?.id;

  try {
    // Get the next issue number for the team
    const lastIssue = await prisma.issue.findFirst({
      where: { teamId },
      orderBy: { number: 'desc' },
      select: { number: true }
    });

    const nextNumber = (lastIssue?.number || 0) + 1;

    // Get workspaceId from team
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { workspaceId: true }
    });

    if (!team) {
      return {
        status: 404,
        message: "Team not found"
      };
    }

    const createdIssue = await prisma.issue.create({
      data: {
        title,
        description,
        state,
        priority,
        labels,
        dueDate: dueDate ? new Date(dueDate) : null,
        workspaceId: team.workspaceId,
        teamId,
        assigneeId,
        creatorId,
        number: nextNumber
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        team: {
          select: {
            key: true,
            name: true
          }
        }
      }
    });

    return {
      status: 201,
      message: "Issue created successfully",
      issue: {
        ...createdIssue,
        issueKey: `${createdIssue.team.key}-${createdIssue.number}` // Linear-style key
      }
    }
  } catch (error) {
    console.error("Error creating issue: ", error);
    return {
      status: 500,
      message: "Failed to create issue",
      error: error.message
    };
  }
};

// Get issues by team or workspace
const getIssues = async (req, res) => {
  const { workspace_id, team_id } = req.params;
  const { state, assignee, priority, search } = req.query;

  try {
    const whereClause = {};

    if (team_id) {
      whereClause.teamId = team_id;
    } else if (workspace_id) {
      whereClause.workspaceId = workspace_id;
    }

    // Add filters
    if (state) whereClause.state = state;
    if (assignee) whereClause.assigneeId = assignee;
    if (priority !== undefined) whereClause.priority = parseInt(priority);
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const issues = await prisma.issue.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        team: {
          select: {
            key: true,
            name: true,
            color: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: [
        { priority: 'asc' }, // Urgent first
        { createdAt: 'desc' }
      ]
    });

    // Transform to include Linear-style keys
    const transformedIssues = issues.map(issue => ({
      ...issue,
      issueKey: `${issue.team.key}-${issue.number}`,
      commentCount: issue._count.comments
    }));

    return {
      status: 200,
      message: "Issues fetched successfully",
      issues: transformedIssues
    }
  } catch (error) {
    console.log("Error fetching issues: ", error);
    return {
      status: 500,
      message: "Failed fetching issues",
      error: error.message
    };
  }
};

// Update issue
const updateIssue = async (req, res) => {
  const { issueId } = req.params;
  const updateData = req.body;

  const allowedFields = ['title', 'description', 'state', 'priority', 'labels', 'dueDate', 'assigneeId', 'notes'];
  const dataToUpdate = {};

  // Only include allowed fields that are provided
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key) && updateData[key] !== undefined) {
      if (key === 'dueDate' && updateData[key]) {
        dataToUpdate[key] = new Date(updateData[key]);
      } else if (key === 'assigneeId' && (updateData[key] === '' || updateData[key] === undefined)) {
        dataToUpdate[key] = null; // treat empty string/undefined as null
      } else {
        dataToUpdate[key] = updateData[key];
      }
    }
  });

  if (Object.keys(dataToUpdate).length === 0) {
    return {
      status: 400,
      message: "No valid fields to update"
    };
  }

  try {
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: dataToUpdate,
      include: {
        creator: {
          select: {
            name: true
          }
        },
        assignee: {
          select: {
            name: true
          }
        },
        team: {
          select: {
            key: true,
            name: true
          }
        }
      }
    });

    return {
      status: 200,
      message: "Issue updated successfully",
      issue: {
        ...updatedIssue,
        issueKey: `${updatedIssue.team.key}-${updatedIssue.number}`
      }
    };
  } catch (error) {
    if (error.code === 'P2025') {
      return {
        status: 404,
        message: "Issue not found"
      };
    }
    console.error("Error updating issue: ", error);
    return {
      status: 500,
      message: "Failed to update issue",
      error: error.message
    };
  }
};

// Delete issue
const deleteIssue = async (req, res) => {
  const { issueId } = req.params;

  try {
    const deletedIssue = await prisma.issue.delete({
      where: { id: issueId },
      include: {
        team: {
          select: {
            key: true
          }
        }
      }
    });

    return {
      status: 200,
      message: "Issue deleted successfully",
      issue: {
        ...deletedIssue,
        issueKey: `${deletedIssue.team.key}-${deletedIssue.number}`
      }
    };
  } catch (error) {
    if (error.code === 'P2025') {
      return {
        status: 404,
        message: "Issue not found"
      };
    }
    console.error("Error deleting issue:", error);
    return {
      status: 500,
      message: "Failed to delete issue",
      error: error.message
    };
  }
};

// API endpoints
createApi().post("/team/:team_id/issues").authSecure(createIssue);
createApi().get("/workspace/:workspace_id/issues").authSecure(getIssues);
createApi().get("/team/:team_id/issues").authSecure(getIssues);
createApi().put("/issues/:issueId").authSecure(updateIssue);
createApi().delete("/issues/:issueId").authSecure(deleteIssue);

module.exports = {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue
};