import { Injectable } from '@angular/core';
import {SocketRootService} from './socket-root.service';

import {Constants} from '../constants/constants';
import {Stomp} from 'stompjs/lib/stomp.js';
import AlbumSuggestion = Constants.AlbumSuggest;
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService extends SocketRootService {
  private socket = new WebSocket(this.ROOT_URL);
  private stompClient = Stomp.over(this.socket);

  private albumSuggestionsBehaviorSubject = new BehaviorSubject(null);

  getAlbumSuggestions(): BehaviorSubject<any> {
    return this.albumSuggestionsBehaviorSubject;
  }

  constructor() {
    super();
    this.connect();
  }

  private connect(): void {
    const _this = this;

    this.stompClient.connect({}, function (frame) {

      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/user/suggested/album', function (greeting) {
        _this.onMessageReceived(greeting);

      }, _this.errorCallBack);
    });
  }

  public getAlbumSuggestion(albumSuggestion: AlbumSuggestion): void {
    this.stompClient.send("/app/suggest/album", {}, JSON.stringify(albumSuggestion));
  }

  //TODO on error, schedule a reconnection attempt, should connect to sockjs as fallback
  private errorCallBack(error) {
    console.log("errorCallBack -> " + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  private onMessageReceived(message){
   this.albumSuggestionsBehaviorSubject.next(
     (JSON.parse(message.body))
   );
  }
}

