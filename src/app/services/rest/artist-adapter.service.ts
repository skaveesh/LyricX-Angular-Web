import {Injectable} from '@angular/core';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {ArtistSaveRequest, ArtistGetResponse} from '../../dto/artist';
import {Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';

@Injectable({
  providedIn: 'root'
})
export class ArtistAdapterService extends GenericAdapter<ArtistGetResponse, ArtistSaveRequest, BasicHttpResponse> {

  constructor() {
    super();
  }

  public getArtist(surrogateKey: string, doRefresh: boolean): Observable<ArtistGetResponse> {
    return super.getObjectBySurrogateKey(this.GET_ARTIST_URL, surrogateKey, doRefresh);
  }

  public saveArtist(payload: ArtistSaveRequest, image: Blob): Observable<BasicHttpResponse> {
    return super.saveObject(this.SAVE_ARTIST_URL, payload, image);
  }
}
