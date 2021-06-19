import {Injectable} from '@angular/core';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {LoadingStatusService} from '../loading-status.service';
import {ArtistCreateRequest, ArtistGetResponse} from '../../dto/artist';
import {Observable} from 'rxjs';
import {GenericAdapter} from './generic-adapter';

@Injectable({
  providedIn: 'root'
})
export class ArtistAdapterService extends GenericAdapter<ArtistGetResponse, ArtistCreateRequest, BasicHttpResponse> {

  constructor(private loadingStatus: LoadingStatusService) {
    super();
  }

  public getArtist(surrogateKey: string, doRefresh: boolean): Observable<ArtistGetResponse> {
    this.loadingStatus.startLoading();

    const observable = super.getObjectBySurrogateKey(this.GET_ARTIST_URL, surrogateKey, doRefresh);

    observable.subscribe().add(() => {
      this.loadingStatus.stopLoading();
    });

    return observable;
  }

  public createArtist(payload: ArtistCreateRequest, image: Blob): Observable<BasicHttpResponse> {

    this.loadingStatus.startLoading();

    const observable = super.createObject(this.CREATE_ARTIST_URL, payload, image);

    observable.subscribe().add(() => {
      this.loadingStatus.stopLoading();
    });

    return observable;
  }
}
