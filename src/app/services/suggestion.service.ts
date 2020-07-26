import {Injectable} from '@angular/core';
import {SocketRootService} from './socket-root.service';

import {Constants} from '../constants/constants';
import {Stomp} from 'stompjs/lib/stomp.js';
import {BehaviorSubject} from 'rxjs';
import ItemSuggestion = Constants.ItemSuggest;
import AlbumSuggestion = Constants.AlbumSuggest;

@Injectable({
  providedIn: 'root'
})
export class SuggestionService extends SocketRootService {
  private socket = new WebSocket(this.ROOT_URL);
  private stompClient = Stomp.over(this.socket);

  private albumSuggestionsBehaviorSubject = new BehaviorSubject(null);

  constructor() {
    super();
    this.connect();
  }

  public getAlbumSuggestions(): BehaviorSubject<any> {
    return this.albumSuggestionsBehaviorSubject;
  }

  private connect(): void {
    const _this = this;

    this.stompClient.connect({}, function (frame) {

      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/user/suggested/album', function (message) {
        _this.onAlbumReceived(message);

      }, _this.errorCallBack);
    });
  }

  public getAlbumSuggestion(itemSuggestion: ItemSuggestion): void {

    let albumSuggestion: AlbumSuggestion = {
      surrogateKey: null,
      albumName: itemSuggestion.name
    };

    if (albumSuggestion.albumName != null && albumSuggestion.albumName.length > 2) {
      this.getSuggestion('/app/suggest/album', JSON.stringify(albumSuggestion));
    }
  }

  private getSuggestion(destination: string, object: any) {
    this.stompClient.send(destination, {}, object);
  }

  //TODO on error, schedule a reconnection attempt, should connect to sockjs as fallback
  private errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  private onAlbumReceived(message) {
    SuggestionService.onMessageReceived(message, this.albumSuggestionsBehaviorSubject);
  }

  private static onMessageReceived(message : any, behaviourSubject : any) {
    behaviourSubject.next(
      (JSON.parse(message.body))
    );
  }
}

