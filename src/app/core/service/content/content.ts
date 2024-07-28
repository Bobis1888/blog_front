import {Status} from "./content.service";
import {Actions} from "./actions";

export interface Content {
  id: string;
  title: string;
  preView: string;
  content: string;
  tags: Array<string>;
  authorName: string;
  countViews: number;
  status: Status;
  publishedDate: Date;
  // todo move to actions can saveToBookmarks, can like ...
  isSaved: boolean;
  reactions: Array<Reaction>;
  actions: Actions;
}

export interface Reaction {
  count: number;
  value: string;
  isUserReaction: boolean;
}
