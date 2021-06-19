import {BaseHttpResponse} from './base-http-response';

export interface SongSaveRequest {
  surrogateKey: string;
  name: string;
  albumSurrogateKey: string;
  guitarKey: string;
  beat: string;
  languageCode: string;
  keywords: string;
  lyrics: string;
  youTubeLink: string;
  spotifyLink: string;
  deezerLink: string;
  appleMusicLink: string;
  isExplicit: boolean;
  artistSurrogateKeyList: string[];
  genreIdList: number[];
}

interface BaseHttpResponseWithSongResponseData {
  'data': SongResponseData;
}

interface SongResponseData {
  surrogateKey: string;
  name: string;
  albumSurrogateKey: string;
  guitarKey: string;
  beat: string;
  languageCode: string;
  keywords: string;
  lyrics: string;
  youTubeLink: string;
  spotifyLink: string;
  deezerLink: string;
  appleMusicLink: string;
  imgUrl: string;
  isExplicit: boolean;
  addedBy: Contributor;
  lastModifiedBy: Contributor;
  publishedBy: Contributor;
  addedDate: Date;
  lastModifiedDate: Date;
  publishedDate: Date;
  publishedState: boolean;
  songModifiesRequestsAvailable: boolean;
  artistSurrogateKeyList: string[];
  genreIdList: number[];
}

interface Contributor {
  firstName: string;
  lastName: string;
  description: string;
  imgUrl: string;
  contactLink: string;
  seniorContributor: boolean;
  addedDate: Date;
  lastModifiedDate: Date;
}

export type SongSaveResponse = BaseHttpResponse & BaseHttpResponseWithSongResponseData;
