import {BaseHttpResponse} from './base-http-response';
import {BasePageableResponse} from './base-pageable-response';

export interface ArtistSuggest {
  surrogateKey: string;
  artistName: string;
}

export interface ArtistSaveRequest {
  surrogateKey?: string;
  name: string;
  genreIdList: number[];
}

interface BaseHttpResponseWithArtistResponseData {
  'data': ArtistResponseData;
}

interface BaseHttpResponseWithSearchArtistResponseData {
  'data': SearchArtistResponseData;
}

export interface ArtistResponseData {
  surrogateKey: string;
  name: string;
  imgUrl: string;
  addedById: string;
  lastModifiedById: string;
  approvedStatus: boolean;
  addedDate: string;
  lastModifiedDate: string;
  genreIdList: number[];
  albumsSurrogateKeyList: string[];
  artistSongsSurrogateKeyList: string[];
}

export interface ArtistResponseDataList {
  artistList: ArtistResponseData[];
}

type SearchArtistResponseData = BasePageableResponse & ArtistResponseDataList;

export type SearchArtistResponse = BaseHttpResponse & BaseHttpResponseWithSearchArtistResponseData;

export type ArtistGetResponse = BaseHttpResponse & BaseHttpResponseWithArtistResponseData;
