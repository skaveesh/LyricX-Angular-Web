import { Injectable } from '@angular/core';
import {HttpRoot} from './http-root';
import {DefaultSnackBarComponent} from '../../components/popups-and-modals/default-snack-bar/default-snack-bar.component';
import {LoadingStatusService} from '../loading-status.service';
import {RestTemplateBuilder} from './rest-template-builder';
import {BasicHttpResponse} from '../../dto/base-http-response';
import {first, map} from 'rxjs/operators';
import {Constants} from '../../constants/constants';
import AppConstant = Constants.AppConstant;

@Injectable({
  providedIn: 'root'
})
export class AlbumAdapterService extends HttpRoot {

  constructor(private snackBar: DefaultSnackBarComponent, private loadingStatus: LoadingStatusService) {
    super();
  }

  public createAlbum(payload: Blob, image: Blob): void {

    this.loadingStatus.startLoading();

    const formData: FormData = new FormData();
    formData.append(AppConstant.PAYLOAD, payload);
    formData.append(AppConstant.IMAGE, image);

    (new RestTemplateBuilder())
      .withAuthHeader()
      .put<FormData, BasicHttpResponse>(this.CREATE_ALBUM_URL, formData)
      .pipe(
        map(response => response.body),
        first())
      .subscribe(response => {
        this.snackBar.openSnackBar('Album Creation Successful', false);
      }, error => {
        console.error(error);
        this.snackBar.openSnackBar('Album Creation Failed', true);
      }).add(() => {
      this.loadingStatus.stopLoading();
    });
  }
}
