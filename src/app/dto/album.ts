import {BaseHttpResponse} from './base-http-response';
import {BasePageableResponse} from './base-pageable-response';

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

interface BaseHttpResponseWithSearchAlbumResponseData {
  'data': SearchAlbumResponseData;
}

export interface AlbumResponseData {
  surrogateKey: string;
  artistSurrogateKey: string;
  artistName: string;
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

export interface AlbumResponseDataList {
  albumList: AlbumResponseData[];
}

type SearchAlbumResponseData = BasePageableResponse & AlbumResponseDataList;

export type SearchAlbumResponse = BaseHttpResponse & BaseHttpResponseWithSearchAlbumResponseData;

export type AlbumGetResponse = BaseHttpResponse & BaseHttpResponseWithAlbumResponseData;
