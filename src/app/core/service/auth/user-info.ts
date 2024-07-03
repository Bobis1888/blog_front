import {Statistics} from "app/core/service/content/statistics";

export interface UserInfo {
  id: string;
  nickname: string;
  registrationDate: Date,
  enabled: boolean;
  hasImage: boolean;
  imageBase64: string;
  email: string;
  description: string | null;
  statistics: Statistics | null;
}
