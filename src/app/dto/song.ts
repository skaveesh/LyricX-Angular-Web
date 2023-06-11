import {BaseHttpResponse} from './base-http-response';
import {ArtistResponseData} from './artist';
import {AlbumResponseData} from './album';
import {ContributorResponseData} from './contributor';
import {BasePageableResponse} from './base-pageable-response';

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

interface BaseHttpResponseWithSearchSongResponseData {
  'data': SearchSongResponseData;
}

export interface SongResponseData {
  surrogateKey: string;
  name: string;
  albumSurrogateKey: string;
  albumName: string;
  artistSurrogateKeyOfTheAlbum: string;
  artistNameOfTheAlbum: string;
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
  addedBy: ContributorResponseData;
  lastModifiedBy: ContributorResponseData;
  publishedBy: ContributorResponseData;
  addedDate: string;
  lastModifiedDate: string;
  publishedDate: string;
  publishedState: boolean;
  songModifiesRequestsAvailable: boolean;
  artistSurrogateKeyList: string[];
  artistNameList: string[];
  genreIdList: number[];
}

export interface SongResponseDataList {
  songList: SongResponseData[];
}

export interface SongWithAlbumAndArtist {
  song?: SongResponseData;
  album?: AlbumResponseData;
  artist?: ArtistResponseData;
}

export interface SongWithArtistList {
  song: SongResponseData;
  artistList?: ArtistResponseData[];
}

type SearchSongResponseData = BasePageableResponse & SongResponseDataList;

export type SearchSongResponse = BaseHttpResponse & BaseHttpResponseWithSearchSongResponseData;

export type SongGetResponse = BaseHttpResponse & BaseHttpResponseWithSongResponseData;
