import {Injectable} from '@angular/core';
import {HttpRoot} from './http-root';
import {RestTemplateBuilder} from './rest-template-builder';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {first, map, share} from 'rxjs/operators';
import {DefaultSnackBarComponent} from '../../components/popups-and-modals/default-snack-bar/default-snack-bar.component';
import {LoadingStatusService} from '../loading-status.service';
import {Constants} from '../../constants/constants';
import {UtilService} from '../util.service';
import {ArtistCreateRequest} from '../../dto/artist';
import {Observable} from 'rxjs';
import AppConstant = Constants.AppConstant;

@Injectable({
  providedIn: 'root'
})
export class ArtistAdapterService extends HttpRoot {

  constructor(private snackBar: DefaultSnackBarComponent, private loadingStatus: LoadingStatusService) {
    super();
  }

  public createArtist(payload: ArtistCreateRequest, image: Blob): Observable<BasicHttpResponse> {

    this.loadingStatus.startLoading();

    const formData: FormData = new FormData();
    formData.append(AppConstant.PAYLOAD, UtilService.dataToBlob(payload));
    formData.append(AppConstant.IMAGE, image);

    const observable = (new RestTemplateBuilder())
      .withAuthHeader()
      .put<FormData, BasicHttpResponse>(this.CREATE_ARTIST_URL, formData)
      .pipe(
        map(response => response.body),
        first(),
        share());

    observable.subscribe().add(() => {
      this.loadingStatus.stopLoading();
    });

    return observable;
  }
}
