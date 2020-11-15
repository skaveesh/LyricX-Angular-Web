import {CropperPosition} from 'ngx-image-cropper';

export interface DialogData {
  injectedTitle: string;
  originalImageBase64: any;
  croppedImageBase64: any;
  cropperPositions: CropperPosition;
}
