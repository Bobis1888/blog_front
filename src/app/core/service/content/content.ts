import {Status} from "./content.service";
import {Actions} from "./actions";
import {UserInfo} from "../auth/user-info";

export interface Content {
  id: string;
  title: string;
  preView: string;
  content: string;
  tags: Array<string>;
  authorName: string;
  authorId: number;
  countViews: number;
  countReactions: number;
  countComments: number;
  status: Status;
  publishedDate: Date;
  // todo move to actions can saveToBookmarks, can like ...
  isSaved: boolean;
  reactions: Array<Reaction>;
  actions: Actions;
  author: UserInfo;
}

export interface Reaction {
  count: number;
  value: string;
  isUserReaction: boolean;
}
