import type { Comment } from '../../generated/prisma';

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface CreateCommentResponse {
  comment: Comment & {
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  };
}

export interface GetCommentsResponse {
  comments: Array<Comment & {
    user: {
      id: string;
      name: string | null;
      email: string;
    };
    replies: Array<Comment & {
      user: {
        id: string;
        name: string | null;
        email: string;
      };
    }>;
  }>;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateCommentResponse {
  comment: Comment;
}

export interface DeleteCommentResponse {
  comment: Comment;
}