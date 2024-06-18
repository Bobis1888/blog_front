import {Status} from "./content.service";
import {Actions} from "./actions";

export interface Article {
  id: string;
  title: string;
  preView: string;
  content: string;
  tags: Array<string>;
  authorName: string;
  status: Status;
  publishedDate: Date;
  isSaved: boolean;
  isLiked: boolean;
  likes: number;
  actions: Actions;
}
