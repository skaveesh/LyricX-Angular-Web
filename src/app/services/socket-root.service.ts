import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketRootService {

  readonly ROOT_URL = 'ws://localhost:8000/lyricx';

}
