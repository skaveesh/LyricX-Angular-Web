import {BaseHttpResponse} from './base-http-response';

export interface AlbumSuggest {
  surrogateKey: string;
  albumName: string;
}

export interface AlbumSaveRequest {
  surrogateKey?: string;
  name: string;
  artistSurrogateKey: string;
  year: number;
}

interface BaseHttpResponseWithAlbumResponseData {
  'data': AlbumResponseData;
}

export interface AlbumResponseData {
  surrogateKey: string;
  artistSurrogateKey: string;
  year: string;
  name: string;
  imgUrl: string;
  addedDate: string;
  lastModifiedDate: string;
  addedById: string;
  lastModifiedById: string;
  approvedStatus: boolean;
  songsSurrogateKeys: string[];
}

export type AlbumGetResponse = BaseHttpResponse & BaseHttpResponseWithAlbumResponseData;
