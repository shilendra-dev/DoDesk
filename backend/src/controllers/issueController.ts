import prisma from '../lib/prisma';
import { createApi } from '../utils/router';
import {
  CreateIssueRequest,
  CreateIssueResponse,
  GetIssuesQuery,
  GetIssuesResponse,
  UpdateIssueRequest,
  UpdateIssueResponse,
  DeleteIssueResponse,
  GetIssueByIdResponse
} from '../types/controllers/issue.types';
import {
  ControllerFunction,
  AuthenticatedRequest,
} from '../types/controllers/base.types';

// CREATE ISSUE
const createIssue: ControllerFunction<CreateIssueResponse> = async (req) => {
  const {
    title,
    description,
    state = "backlog",
    priority = 0,
    labels = [],
    dueDate,
    teamId,
    assigneeId
  }: CreateIssueRequest = req.body;

  const creatorId = (req as AuthenticatedRequest).user.id;

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
        description: description || null,
        state,
        priority,
        labels,
        dueDate: dueDate ? new Date(dueDate) : null,
        workspaceId: team.workspaceId,
        teamId,
        assigneeId: assigneeId || null,
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
      } as any
    };
  } catch (error) {
    console.error("Error creating issue: ", error);
    return {
      status: 500,
      message: "Failed to create issue",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

//GET ISSUE BY ID
const getIssueById: ControllerFunction<GetIssueByIdResponse> = async (req) => {
  const { issueId } = req.params;

  if (!issueId) {
    return {
      status: 400,
      message: "Issue ID is required"
    };
  }

  try {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
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
      }
    });

    if (!issue) {
      return {
        status: 404,
        message: "Issue not found"
      };
    }

    return {
      status: 200,
      message: "Issue fetched successfully",
      issue: {
        ...issue,
        issueKey: `${issue.team.key}-${issue.number}`,
        commentCount: issue._count.comments
      } as any
    };
  } catch (error) {
    console.error("Error fetching issue: ", error);
    return {
      status: 500,
      message: "Failed to fetch issue",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// GET ISSUES BY TEAM OR WORKSPACE
const getIssues: ControllerFunction<GetIssuesResponse> = async (req) => {
  const { workspace_id, team_id } = req.params;
  const { state, assignee, priority, search }: GetIssuesQuery = req.query;

  try {
    const whereClause: any = {};

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
      issues: transformedIssues as any
    };
  } catch (error) {
    console.log("Error fetching issues: ", error);
    return {
      status: 500,
      message: "Failed fetching issues",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// UPDATE ISSUE
const updateIssue: ControllerFunction<UpdateIssueResponse> = async (req) => {
  const { issueId } = req.params;
  const updateData: UpdateIssueRequest = req.body;

  if (!issueId) {
    return {
      status: 400,
      message: "Issue ID is required"
    };
  }

  const allowedFields = ['title', 'description', 'state', 'priority', 'labels', 'dueDate', 'assigneeId', 'notes'];
  const dataToUpdate: any = {};

  // Only include allowed fields that are provided
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key) && updateData[key as keyof UpdateIssueRequest] !== undefined) {
      if (key === 'dueDate' && updateData[key as keyof UpdateIssueRequest]) {
        dataToUpdate[key] = new Date(updateData[key as keyof UpdateIssueRequest] as string);
      } else if (key === 'assigneeId' && (updateData[key as keyof UpdateIssueRequest] === '' || updateData[key as keyof UpdateIssueRequest] === undefined)) {
        dataToUpdate[key] = null; // treat empty string/undefined as null
      } else {
        dataToUpdate[key] = updateData[key as keyof UpdateIssueRequest];
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
      } as any
    };
  } catch (error: any) {
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
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// DELETE ISSUE
const deleteIssue: ControllerFunction<DeleteIssueResponse> = async (req) => {
  const { issueId } = req.params;

  if (!issueId) {
    return {
      status: 400,
      message: "Issue ID is required"
    };
  }

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
      data: {
        issue: {
          ...deletedIssue,
          issueKey: `${deletedIssue.team.key}-${deletedIssue.number}`
        } as any
      }
    };
  } catch (error: any) {
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
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// API endpoints
createApi().post("/team/:team_id/issues").authSecure(createIssue);
createApi().get("/workspace/:workspace_id/issues").authSecure(getIssues);
createApi().get("/team/:team_id/issues").authSecure(getIssues);
createApi().put("/issues/:issueId").authSecure(updateIssue);
createApi().delete("/issues/:issueId").authSecure(deleteIssue);
createApi().get("/issues/:issueId").authSecure(getIssueById);

// Export for testing
export {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue,
  getIssueById
}; 