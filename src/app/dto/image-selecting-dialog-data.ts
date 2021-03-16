import {ImageUploadData} from './image-upload-data';

interface InjectedTitle {
  injectedTitle: string;
}

export type DialogData = InjectedTitle & ImageUploadData;
