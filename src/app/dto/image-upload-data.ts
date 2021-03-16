import {CropperPosition} from 'ngx-image-cropper';

export interface ImageUploadData {
  originalImageBase64: string | ArrayBuffer;
  croppedImageBase64: string | ArrayBuffer;
  croppedImagePositions: CropperPosition;
}
