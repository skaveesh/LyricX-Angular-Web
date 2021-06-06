import { Injectable } from '@angular/core';
import {HttpRoot} from './http-root';
import {DefaultSnackBarComponent} from '../../components/popups-and-modals/default-snack-bar/default-snack-bar.component';
import {LoadingStatusService} from '../loading-status.service';
import {RestTemplateBuilder} from './rest-template-builder';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {first, map, share} from 'rxjs/operators';
import {Constants} from '../../constants/constants';
import AppConstant = Constants.AppConstant;
import {UtilService} from '../util.service';
import {AlbumCreateRequest} from '../../dto/album';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumAdapterService extends HttpRoot {

  constructor(private snackBar: DefaultSnackBarComponent, private loadingStatus: LoadingStatusService) {
    super();
  }

  public createAlbum(payload: AlbumCreateRequest, image: Blob): Observable<BasicHttpResponse> {

    this.loadingStatus.startLoading();

    const formData: FormData = new FormData();
    formData.append(AppConstant.PAYLOAD, UtilService.dataToBlob(payload));
    formData.append(AppConstant.IMAGE, image);

    const observable = (new RestTemplateBuilder())
      .withAuthHeader()
      .put<FormData, BasicHttpResponse>(this.CREATE_ALBUM_URL, formData)
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
