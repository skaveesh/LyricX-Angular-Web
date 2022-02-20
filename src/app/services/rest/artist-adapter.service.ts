import {Injectable} from '@angular/core';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {ArtistSaveRequest, ArtistGetResponse, SearchArtistResponse} from '../../dto/artist';
import {Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';

@Injectable({
  providedIn: 'root'
})
export class ArtistAdapterService extends GenericAdapter<ArtistGetResponse, ArtistSaveRequest, BasicHttpResponse, SearchArtistResponse> {

  constructor() {
    super();
  }

  public getArtist(surrogateKey: string, doRefresh: boolean): Observable<ArtistGetResponse> {
    return super.getObjectBySurrogateKey(this.GET_ARTIST_URL, surrogateKey, doRefresh);
  }

  public searchAlbum(query: string, pageNumber: number, pageSize: number): Observable<SearchArtistResponse> {
    return super.searchPageable(this.SEARCH_ARTIST_URL, query, pageNumber, pageSize);
  }

  public saveArtist(payload: ArtistSaveRequest, image: Blob): Observable<BasicHttpResponse> {
    return super.saveObject(this.SAVE_ARTIST_URL, payload, image);
  }
}
