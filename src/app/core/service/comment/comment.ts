export interface Comment {
  id: number;
  nickname: string;
  content: string;
  date: Date;
  rating: number
}

export interface CommentList {
  list: Array<Comment>;
  totalPages: number;
  totalRows: number;
}
