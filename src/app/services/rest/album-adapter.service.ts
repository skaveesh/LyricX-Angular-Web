import {Injectable} from '@angular/core';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {AlbumSaveRequest, AlbumGetResponse, SearchAlbumResponse} from '../../dto/album';
import {Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';

@Injectable({
  providedIn: 'root'
})
export class AlbumAdapterService extends GenericAdapter<AlbumGetResponse, AlbumSaveRequest, BasicHttpResponse, SearchAlbumResponse> {

  constructor() {
    super();
  }

  public getAlbum(surrogateKey: string, doRefresh: boolean): Observable<AlbumGetResponse> {
    return super.getObjectBySurrogateKey(this.GET_ALBUM_URL, surrogateKey, doRefresh);
  }

  public searchAlbum(query: string, pageNumber: number, pageSize: number): Observable<SearchAlbumResponse> {
    return super.searchPageable(this.SEARCH_ALBUM_URL, query, pageNumber, pageSize);
  }

  public saveAlbum(payload: AlbumSaveRequest, image: Blob): Observable<BasicHttpResponse> {
    return super.saveObject(this.SAVE_ALBUM_URL, payload, image);
  }
}
