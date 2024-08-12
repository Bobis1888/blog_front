export interface Comment {
  id: number;
  nickname: string;
  content: string;
  date: Date;
  rating: number
  actions: Actions;
}

export interface Actions {
  canDelete: boolean;
  canEdit: boolean;
  canReport: boolean;
  canVote: boolean;
}

export interface CommentList {
  list: Array<Comment>;
  totalPages: number;
  totalRows: number;
}
