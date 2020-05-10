import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketRootService {

  readonly ROOT_URL = 'ws://localhost:8000/lyricx';

}
