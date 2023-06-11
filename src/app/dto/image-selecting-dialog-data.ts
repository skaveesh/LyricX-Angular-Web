import {ImageUploadData} from './image-upload-data';

interface InjectedTitle {
  injectedTitle: string;
}

export type ImageSelectingDialogData = InjectedTitle & ImageUploadData;
