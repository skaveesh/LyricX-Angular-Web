import {BaseHttpResponse} from './base-http-response';

export interface AlbumSuggest {
  surrogateKey: string;
  albumName: string;
}

export interface AlbumCreateRequest {
  name: string;
  artistSurrogateKey: string;
  year: number;
}

interface BaseHttpResponseWithAlbumResponseData {
  'data': AlbumResponseData;
}

export interface AlbumResponseData {
  surrogateKey: string;
  name: string;
  artistSurrogateKey: string;
  year: string;
  approvedStatus: boolean;
}

export type AlbumGetResponse = BaseHttpResponse & BaseHttpResponseWithAlbumResponseData;
