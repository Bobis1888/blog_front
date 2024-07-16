import {Statistics} from "app/core/service/content/statistics";

export interface UserInfo {
  id: string;
  nickname: string;
  registrationDate: Date;
  enabled: boolean;
  hasImage: boolean;
  imagePath: string;
  email: string;
  description: string | null;
  isPremiumUser: boolean;
  statistics: Statistics | null;
  additionalInfo: AdditionalInfo | null;
}

export interface AdditionalInfo {
  canSubscribe: boolean;
  registrationDate: number;
}
