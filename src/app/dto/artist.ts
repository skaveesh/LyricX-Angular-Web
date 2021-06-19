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
  surrogateKey:   string;
  name:           string;
  approvedStatus: boolean;
  genreIdList:    number[];
}

export type ArtistGetResponse = BaseHttpResponse & BaseHttpResponseWithArtistResponseData;
