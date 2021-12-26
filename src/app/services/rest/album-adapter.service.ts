import {Injectable} from '@angular/core';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {AlbumCreateRequest, AlbumGetResponse} from '../../dto/album';
import {Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';

@Injectable({
  providedIn: 'root'
})
export class AlbumAdapterService extends GenericAdapter<AlbumGetResponse, AlbumCreateRequest, BasicHttpResponse> {

  constructor() {
    super();
  }

  public getAlbum(surrogateKey: string, doRefresh: boolean): Observable<AlbumGetResponse> {
    return super.getObjectBySurrogateKey(this.GET_ALBUM_URL, surrogateKey, doRefresh);
  }

  public createAlbum(payload: AlbumCreateRequest, image: Blob): Observable<BasicHttpResponse> {
    return super.createObject(this.CREATE_ALBUM_URL, payload, image);
  }
}
