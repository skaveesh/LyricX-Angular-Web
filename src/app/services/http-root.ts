import {HttpHeaders} from '@angular/common/http';

export class HttpRoot {
  readonly ROOT_URL = 'http://localhost:8080/';

  readonly jsonHeader = new HttpHeaders(
    {
      'Content-Type': 'application/json'
    });
}
