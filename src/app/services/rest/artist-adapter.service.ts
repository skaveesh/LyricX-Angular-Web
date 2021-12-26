import {Injectable} from '@angular/core';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {ArtistCreateRequest, ArtistGetResponse} from '../../dto/artist';
import {Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';

@Injectable({
  providedIn: 'root'
})
export class ArtistAdapterService extends GenericAdapter<ArtistGetResponse, ArtistCreateRequest, BasicHttpResponse> {

  constructor() {
    super();
  }

  public getArtist(surrogateKey: string, doRefresh: boolean): Observable<ArtistGetResponse> {
    return super.getObjectBySurrogateKey(this.GET_ARTIST_URL, surrogateKey, doRefresh);
  }

  public createArtist(payload: ArtistCreateRequest, image: Blob): Observable<BasicHttpResponse> {
    return super.createObject(this.CREATE_ARTIST_URL, payload, image);
  }
}
