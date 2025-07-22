const prisma = require("../lib/prisma");
const { createApi } = require("../utils/router");

//get comments related to a issue
const getComments = async (req, res) => {
  const { issueId } = req.params;
  if (!issueId) {
    return {
      status: 400,
      message: "Issue ID is required",
    };
  }
  try {
    // Fetch comments related to the issueId from the database
    const comments = await prisma.comment.findMany({
      where: { issueId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return {
      status: 200,
      message: "Comments fetched successfully",
      comments: comments,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};
createApi().get("/issues/:issueId/comments").authSecure(getComments); // for fetching comments related to a task

// CREATE A NEW COMMENT
const createComment = async (req, res) => {
  // Extracting issueId from request parameters
  const { issueId } = req.params;
  // Extracting userId, content, and parentCommentId from request body
  const { content, parentCommentId } = req.body;
  const userId = req.user?.id;

  // Check if issueId, userId, and content are provided
  if (!issueId || !userId || !content) {
    return {
      status: 400,
      message: "Issue ID, User ID, and content are required",
    };
  }
  try {
    // Insert the new comment into the database query
    const comment = await prisma.comment.create({
      data: {
        issueId,
        userId,
        content,
        parentCommentId: parentCommentId || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return {
      status: 201,
      message: "Comment created successfully",
      comment,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};
createApi().post("/issues/:issueId/comments").authSecure(createComment); // for creating a new comment

// UPDATE A COMMENT
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!id || !content) {
    return {
      status: 400,
      message: "Comment ID and content are required",
    };
  }
  try {
    const updated = await prisma.comment.update({
      where: { id },
      data: { content, updatedAt: new Date() },
    });
    return {
      status: 200,
      message: "Comment updated successfully",
      comment: updated,
    };
  } catch (error) {
    if (error.code === "P2025") {
      return { status: 404, message: "Comment not found" };
    }
    console.error("Error updating comment:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};
createApi().put("/comments/:id").authSecure(updateComment); // for updating a comment

// DELETE A COMMENT
const deleteComment = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return {
      status: 400,
      message: "Comment ID is required",
    };
  }
  try {
    // Delete the comment from the database query
    const deleted = await prisma.comment.delete({
      where: { id },
    });

    return {
      status: 200,
      message: "Comment deleted successfully",
      comment: deleted,
    };
  } catch (error) {
    if (error.code === "P2025") {
      return { status: 404, message: "Comment not found" };
    }
    console.error("Error deleting comment:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};
createApi().delete("/comments/:id").authSecure(deleteComment); // for deleting a comment

module.exports = {
    getComments,
    createComment,
    updateComment,
    deleteComment
  };