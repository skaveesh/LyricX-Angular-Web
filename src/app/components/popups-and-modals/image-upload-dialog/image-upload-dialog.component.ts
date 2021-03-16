import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA,  MatDialogRef} from '@angular/material';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {DialogData} from '../../../dto/dialog-data';
import {DefaultSnackBarComponent} from '../default-snack-bar/default-snack-bar.component';

@Component({
  selector: 'app-default-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.css']
})
export class ImageUploadDialogComponent {

  @ViewChild('imageCropperElement', {static: false}) imageCropper: ImageCropperComponent;

  imageChangedEvent: any = '';

  constructor(public dialogRef: MatDialogRef<ImageUploadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private defaultSnackBar: DefaultSnackBarComponent) {}

  isCropperReady = false;

  onCancelClick(): void {
    this.dialogRef.close();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.data.originalImageBase64 = reader.result;
    };
    reader.onerror = () => {
      throw new Error('Error while loading image.');
    };

  }

  imageCropped(event: ImageCroppedEvent) {
    if (this.isCropperReady) {
      this.data.croppedImageBase64 = event.base64;
    }
  }

  cropperReady() {
    if (isNotNullOrUndefined(this.data.croppedImagePositions)) {
      this.imageCropper.cropper.x1 = this.data.croppedImagePositions.x1;
      this.imageCropper.cropper.x2 = this.data.croppedImagePositions.x2;
      this.imageCropper.cropper.y1 = this.data.croppedImagePositions.y1;
      this.imageCropper.cropper.y2 = this.data.croppedImagePositions.y2;
    } else {
      this.data.croppedImageBase64 = this.data.originalImageBase64;
    }

    this.data.croppedImagePositions = this.imageCropper.cropper;

    this.isCropperReady = true;
  }

  loadImageFailed() {
    this.defaultSnackBar.openSnackBar('Image loading failed. Please try again. (Only png, gif and jpg are allowed.)', true);
  }

}
