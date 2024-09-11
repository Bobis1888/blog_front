export interface Comment {
  id: number;
  nickname: string;
  content: string;
  date: Date;
  rating: number
  actions: Actions;
  parent?: ParentComment;
}

export interface ParentComment {
  nickname: string;
  content: string;
}

export interface Actions {
  canDelete: boolean;
  canReply: boolean;
  canReport: boolean;
  canVote: boolean;
}

export interface CommentList {
  list: Array<Comment>;
  totalPages: number;
  totalRows: number;
}
