import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpMethod, HttpSenderService} from "app/core/service/base/http-sender.service";
import {SuccessDto} from "app/core/dto/success-dto";

@Injectable({
  providedIn: 'any'
})
export class FileService {

  constructor(private httpSender: HttpSenderService) {}

  upload(file: File, type: string = ''): Observable<SuccessDto> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('type', type);

    return this.httpSender.send(
      HttpMethod.POST,
      '/content/assets/file/upload',
      formData);
  }

  get() {

  }
}
