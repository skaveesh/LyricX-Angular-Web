import {Injectable} from '@angular/core';
import {SocketRootService} from './socket-root.service';

import {Constants} from '../constants/constants';
import {Stomp} from 'stompjs/lib/stomp.js';
import {BehaviorSubject} from 'rxjs';
import ItemSuggestion = Constants.ItemSuggest;
import AlbumSuggestion = Constants.AlbumSuggest;
import ArtistSuggestion = Constants.ArtistSuggest;

@Injectable({
  providedIn: 'root'
})
export class SuggestionService extends SocketRootService {

  private albumSocket = new WebSocket(this.ROOT_URL);
  private artistSocket = new WebSocket(this.ROOT_URL);

  private albumStompClient = Stomp.over(this.albumSocket);
  private artistStompClient = Stomp.over(this.artistSocket);

  private albumSuggestionsBehaviorSubject = new BehaviorSubject(null);
  private artistSuggestionsBehaviorSubject = new BehaviorSubject(null);

  constructor() {
    super();
    this.connect();
  }

  public getAlbumSuggestions(): BehaviorSubject<any> {
    return this.albumSuggestionsBehaviorSubject;
  }

  public getArtistSuggestions(): BehaviorSubject<any> {
    return this.artistSuggestionsBehaviorSubject;
  }

  private connect(): void {
    const _this = this;

    this.albumStompClient.connect({}, function (frame) {

      console.log('Connected: ' + frame);

      _this.albumStompClient.subscribe('/user/suggested/album', function (message) {
        _this.onAlbumReceived(message);

      }, _this.errorCallBack);
    });

    this.artistStompClient.connect({}, function (frame) {

      console.log('Connected: ' + frame);

      _this.artistStompClient.subscribe('/user/suggested/artist', function (message) {
        _this.onArtistReceived(message);

      }, _this.errorCallBack);
    });
  }

  public getAlbumSuggestion(itemSuggestion: ItemSuggestion): void {
    let albumSuggestion: AlbumSuggestion = {
      surrogateKey: null,
      albumName: itemSuggestion.name
    };

    if (albumSuggestion.albumName != null && albumSuggestion.albumName.length >= 1) {
      this.albumStompClient.send('/app/suggest/album', {}, JSON.stringify(albumSuggestion));
    }
  }

  public getArtistSuggestion(itemSuggestion: ItemSuggestion): void {
    let artistSuggestion: ArtistSuggestion = {
      surrogateKey: null,
      artistName: itemSuggestion.name
    };

    if (artistSuggestion.artistName != null && artistSuggestion.artistName.length >= 1) {
      this.artistStompClient.send('/app/suggest/artist', {}, JSON.stringify(artistSuggestion));
    }
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

  private onArtistReceived(message) {
    SuggestionService.onMessageReceived(message, this.artistSuggestionsBehaviorSubject);
  }

  private static onMessageReceived(message : any, behaviourSubject : any) {
    behaviourSubject.next(
      (JSON.parse(message.body))
    );
  }
}

