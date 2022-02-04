import {Injectable} from '@angular/core';
import {SongGetResponse, SongSaveUpdateRequest} from '../../dto/song';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';

@Injectable({
  providedIn: 'root'
})
export class SongAdapterService extends GenericAdapter<SongGetResponse, SongSaveUpdateRequest, BasicHttpResponse> {

  constructor() {
    super();
  }

  public getSong(surrogateKey: string, doRefresh: boolean): Observable<SongGetResponse> {
    return super.getObjectBySurrogateKey(this.GET_SONG_URL, surrogateKey, doRefresh);
  }

  public saveSong(payload: SongSaveUpdateRequest, image: Blob = null): Observable<BasicHttpResponse> {
    const url = image ? this.SAVE_SONG_ALBUMART_URL : this.SAVE_SONG_DETAILS_URL;
    return super.createObject(url, payload, image);
  }
}
