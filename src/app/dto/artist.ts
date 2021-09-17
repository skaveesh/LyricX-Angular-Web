import {BaseHttpResponse} from './base-http-response';

export interface ArtistSuggest {
  surrogateKey: string;
  artistName: string;
}

export interface ArtistCreateRequest {
  name: string;
  genreIdList: number[];
}

interface BaseHttpResponseWithArtistResponseData {
  'data': ArtistResponseData;
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

export type ArtistGetResponse = BaseHttpResponse & BaseHttpResponseWithArtistResponseData;
