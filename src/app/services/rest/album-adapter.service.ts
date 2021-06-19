import {Injectable} from '@angular/core';
import {LoadingStatusService} from '../loading-status.service';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {AlbumCreateRequest, AlbumGetResponse} from '../../dto/album';
import {Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';

@Injectable({
  providedIn: 'root'
})
export class AlbumAdapterService extends GenericAdapter<AlbumGetResponse, AlbumCreateRequest, BasicHttpResponse> {

  constructor(private loadingStatus: LoadingStatusService) {
    super();
  }

  public getAlbum(surrogateKey: string, doRefresh: boolean): Observable<AlbumGetResponse> {
    this.loadingStatus.startLoading();

    const observable = super.getObjectBySurrogateKey(this.GET_ALBUM_URL, surrogateKey, doRefresh);

    observable.subscribe().add(() => {
      this.loadingStatus.stopLoading();
    });

    return observable;
  }

  public createAlbum(payload: AlbumCreateRequest, image: Blob): Observable<BasicHttpResponse> {

    this.loadingStatus.startLoading();

    const observable = super.createObject(this.CREATE_ALBUM_URL, payload, image);

    observable.subscribe().add(() => {
      this.loadingStatus.stopLoading();
    });

    return observable;
  }
}
