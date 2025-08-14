import prisma from '../lib/prisma';
import { createApi } from '../utils/router';
import {
  GetCommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse
} from '../types/controllers/comment.types';
import {
  ControllerFunction,
  AuthenticatedRequest,
  IssueRequest
} from '../types/controllers/base.types';

// GET COMMENTS RELATED TO AN ISSUE
const getComments: ControllerFunction<GetCommentsResponse> = async (req) => {
  const { issueId } = (req as IssueRequest).params;
  
  if (!issueId) {
    return {
      status: 400,
      message: "Issue ID is required"
    };
  }

  try {
    // Fetch comments related to the issueId from the database
    const comments = await prisma.comment.findMany({
      where: { 
        issueId,
        user: { isNot: null }
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        replies: {
          where: {
            user: { isNot: null }
          },
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return {
      status: 200,
      message: "Comments fetched successfully",
      data: { comments: comments as any }
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().get("/issues/:issueId/comments").authSecure(getComments);

// CREATE A NEW COMMENT
const createComment: ControllerFunction<CreateCommentResponse> = async (req) => {
  const { issueId } = (req as IssueRequest).params;
  const { content, parentCommentId }: CreateCommentRequest = req.body;
  const userId = (req as AuthenticatedRequest).user.id;

  // Check if issueId, userId, and content are provided
  if (!issueId || !userId || !content) {
    return {
      status: 400,
      message: "Issue ID, User ID, and content are required"
    };
  }

  try {
    // Insert the new comment into the database query
    const comment = await prisma.comment.create({
      data: {
        issueId,
        userId,
        content,
        parentCommentId: parentCommentId || null
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return {
      status: 201,
      message: "Comment created successfully",
      data: { comment: comment as any }
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().post("/issues/:issueId/comments").authSecure(createComment);

// UPDATE A COMMENT
const updateComment: ControllerFunction<UpdateCommentResponse> = async (req) => {
  const { id } = req.params;
  const { content }: UpdateCommentRequest = req.body;

  if (!id || !content) {
    return {
      status: 400,
      message: "Comment ID and content are required"
    };
  }

  try {
    const updated = await prisma.comment.update({
      where: { id },
      data: { content, updatedAt: new Date() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return {
      status: 200,
      message: "Comment updated successfully",
      data: { comment: updated }
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { status: 404, message: "Comment not found" };
    }
    console.error("Error updating comment:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().put("/comments/:id").authSecure(updateComment);

// DELETE A COMMENT
const deleteComment: ControllerFunction<DeleteCommentResponse> = async (req) => {
  const { id } = req.params;
  
  if (!id) {
    return {
      status: 400,
      message: "Comment ID is required"
    };
  }

  try {
    // Delete the comment from the database query
    const deleted = await prisma.comment.delete({
      where: { id }
    });

    return {
      status: 200,
      message: "Comment deleted successfully",
      data: { comment: deleted }
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { status: 404, message: "Comment not found" };
    }
    console.error("Error deleting comment:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().delete("/comments/:id").authSecure(deleteComment);

// Export for testing
export {
  getComments,
  createComment,
  updateComment,
  deleteComment
}; 