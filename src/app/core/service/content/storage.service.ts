import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";

export interface UploadResponse {
  success: boolean;
  uuid: string;
}

export enum FileType {
  AVATAR = 'AVATAR',
  TMP = 'TMP'
}

@Injectable({
  providedIn: 'any'
})
export class StorageService {

  constructor(private httpSender: HttpSenderService) {
  }

  upload(file: File, type: FileType = FileType.TMP): Observable<UploadResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('type', type);

    return this.httpSender.send(
      HttpMethod.POST,
      '/storage/upload',
      formData);
  }

  download(uuid: string): Observable<File> {
    return this.httpSender.download(
      '/storage/download?uuid=' + uuid);
  }
}
