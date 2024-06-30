import {Statistics} from "app/core/service/content/statistics";

export interface UserInfo {
  id: string;
  nickname: string;
  image: string;
  email: string;
  about: string;
  statistics: Statistics;
}
