import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {ImageUploadDialogComponent} from '../components/popups-and-modals/image-upload-dialog/image-upload-dialog.component';
import {ImageSelectingDialogData} from '../dto/image-selecting-dialog-data';
import {MatDialog} from '@angular/material';
import {CropperPosition} from 'ngx-image-cropper';
import {ImageUploadData} from '../dto/image-upload-data';
import {Observable, Subject} from 'rxjs';

export class ImageUploadDialogFacade {

  private dialog: MatDialog;

  private croppedImageBase64Result: string | ArrayBuffer;
  private originalImageBase64Result: string | ArrayBuffer;
  private croppedImagePositionsResult: CropperPosition;

  constructor(dialog: MatDialog) {
    this.dialog = dialog;
  }

  public openImageSelectingDialog(injectedTitle: string, croppedImageBase64: string | ArrayBuffer,
                                  originalImageBase64: string | ArrayBuffer,
                                  croppedImagePositions: CropperPosition): Observable<ImageUploadData> {

    this.croppedImageBase64Result = croppedImageBase64;
    this.originalImageBase64Result = originalImageBase64;
    this.croppedImagePositionsResult = croppedImagePositions;

    const dataObj: ImageSelectingDialogData = isNotNullOrUndefined(croppedImageBase64) ?
      {injectedTitle: injectedTitle, originalImageBase64: originalImageBase64, croppedImagePositions: croppedImagePositions, croppedImageBase64: null} :
      {injectedTitle: injectedTitle, originalImageBase64: null, croppedImagePositions: null, croppedImageBase64: null};

    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      disableClose: true,
      maxWidth: '90vw',
      data: dataObj
    });

    const imageUploadDataSubject = new Subject<ImageUploadData>();

    dialogRef.afterClosed().subscribe((result: ImageSelectingDialogData) => {
      if (isNotNullOrUndefined(result)) {
        if (isNotNullOrUndefined(result.originalImageBase64)) {
          this.originalImageBase64Result = result.originalImageBase64;
        }

        if (isNotNullOrUndefined(result.croppedImageBase64)) {
          this.croppedImageBase64Result = result.croppedImageBase64;
        }

        if (isNotNullOrUndefined(result.croppedImagePositions)) {
          this.croppedImagePositionsResult = result.croppedImagePositions;
        }
      }

      imageUploadDataSubject.next({
        croppedImageBase64: this.croppedImageBase64Result,
        croppedImagePositions: this.croppedImagePositionsResult,
        originalImageBase64: this.originalImageBase64Result
      });

    });

    return imageUploadDataSubject;
  }
}
