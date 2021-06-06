import { Injectable } from '@angular/core';
import {HttpRoot} from './http-root';
import {DefaultSnackBarComponent} from '../../components/popups-and-modals/default-snack-bar/default-snack-bar.component';
import {LoadingStatusService} from '../loading-status.service';
import {SongSaveRequest} from '../../dto/song';
import {UtilService} from '../util.service';
import {RestTemplateBuilder} from './rest-template-builder';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {first, map, share} from 'rxjs/operators';
import {Constants} from '../../constants/constants';
import AppConstant = Constants.AppConstant;
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongAdapterService extends HttpRoot {

  constructor(private snackBar: DefaultSnackBarComponent, private loadingStatus: LoadingStatusService) {
    super();
  }

  public saveSong(payload: SongSaveRequest, image: Blob, withAlbumArt: boolean = false): Observable<BasicHttpResponse> {

    const url = withAlbumArt ? this.SAVE_SONG_ALBUMART_URL : this.SAVE_SONG_DETAILS_URL;

    this.loadingStatus.startLoading();

    const formData: FormData = new FormData();
    formData.append(AppConstant.PAYLOAD, UtilService.dataToBlob(payload));
    formData.append(AppConstant.IMAGE, image);

    const observable = (new RestTemplateBuilder())
      .withAuthHeader()
      .put<FormData, BasicHttpResponse>(url, formData)
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
