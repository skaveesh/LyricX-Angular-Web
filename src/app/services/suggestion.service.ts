import {Injectable} from '@angular/core';
import {SocketRootService} from './socket-root.service';
import {Stomp} from 'stompjs/lib/stomp.js';
import {BehaviorSubject} from 'rxjs';
import {ItemSuggest} from '../dto/item-suggest';
import {AlbumSuggest} from '../dto/album';
import {ArtistSuggest} from '../dto/artist';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService extends SocketRootService {

  constructor() {
    super();
    this.connect();
  }

  private albumSocket = new WebSocket(this.ROOT_URL);
  private artistSocket = new WebSocket(this.ROOT_URL);

  private albumStompClient = Stomp.over(this.albumSocket);
  private artistStompClient = Stomp.over(this.artistSocket);

  private albumSuggestionsBehaviorSubject = new BehaviorSubject(null);
  private artistSuggestionsBehaviorSubject = new BehaviorSubject(null);

  private static onMessageReceived(message: any, behaviourSubject: any) {
    behaviourSubject.next(
      (JSON.parse(message.body))
    );
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

      _this.albumStompClient.subscribe('/user/suggested/album', function (message) {
        _this.onAlbumReceived(message);

      }, _this.errorCallBack);
    });

    this.artistStompClient.connect({}, function (frame) {

      _this.artistStompClient.subscribe('/user/suggested/artist', function (message) {
        _this.onArtistReceived(message);

      }, _this.errorCallBack);
    });
  }

  public getAlbumSuggestion(itemSuggestion: ItemSuggest): void {
    const albumSuggestion: AlbumSuggest = {
      surrogateKey: null,
      albumName: itemSuggestion.name
    };

    if (albumSuggestion.albumName != null && albumSuggestion.albumName.length >= 1) {
      this.albumStompClient.send('/app/suggest/album', {}, JSON.stringify(albumSuggestion));
    }
  }

  public getArtistSuggestion(itemSuggestion: ItemSuggest): void {
    const artistSuggestion: ArtistSuggest = {
      surrogateKey: null,
      artistName: itemSuggestion.name
    };

    if (artistSuggestion.artistName != null && artistSuggestion.artistName.length >= 1) {
      this.artistStompClient.send('/app/suggest/artist', {}, JSON.stringify(artistSuggestion));
    }
  }

  // TODO on error, schedule a reconnection attempt, should connect to sockjs as fallback
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
}

