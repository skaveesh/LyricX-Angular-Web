import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA,  MatDialogRef} from '@angular/material';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {DialogData} from '../../../dto/dialog-data';

@Component({
  selector: 'app-default-dialog',
  templateUrl: './default-dialog.component.html',
  styleUrls: ['./default-dialog.component.css']
})
export class DefaultDialogComponent {

  @ViewChild('imageCropperElement', {static: false}) imageCropper: ImageCropperComponent;

  imageChangedEvent: any = '';

  constructor(public dialogRef: MatDialogRef<DefaultDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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
    this.data.croppedImageBase64 = event.base64;
  }

  cropperReady() {
    if (isNotNullOrUndefined(this.data.cropperPositions)) {
      this.imageCropper.cropper.x1 = this.data.cropperPositions.x1;
      this.imageCropper.cropper.x2 = this.data.cropperPositions.x2;
      this.imageCropper.cropper.y1 = this.data.cropperPositions.y1;
      this.imageCropper.cropper.y2 = this.data.cropperPositions.y2;
    }

    this.data.cropperPositions = this.imageCropper.cropper;
  }

  loadImageFailed() {
  }
}
