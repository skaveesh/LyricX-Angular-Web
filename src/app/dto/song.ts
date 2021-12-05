import {BaseHttpResponse} from './base-http-response';
import {ArtistGetResponse} from './artist';
import {AlbumGetResponse} from './album';

export interface SongSaveUpdateRequest {
  surrogateKey: string;
  name?: string;
  albumSurrogateKey?: string;
  guitarKey?: string;
  beat?: string;
  languageCode?: string;
  keywords?: string;
  lyrics?: string;
  youTubeLink?: string;
  spotifyLink?: string;
  deezerLink?: string;
  appleMusicLink?: string;
  isExplicit?: boolean;
  artistSurrogateKeyList?: string[];
  genreIdList?: number[];
  publishedState?: boolean;
}

interface BaseHttpResponseWithSongResponseData {
  'data': SongResponseData;
}

export interface SongResponseData {
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
  addedDate: string;
  lastModifiedDate: string;
  publishedDate: string;
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
  addedDate: string;
  lastModifiedDate: string;
}

export interface SongWithAlbumAndArtist {
  song: SongResponseData;
  album?: AlbumGetResponse;
  artist?: ArtistGetResponse;
}

export type SongSaveResponse = BaseHttpResponse & BaseHttpResponseWithSongResponseData;
