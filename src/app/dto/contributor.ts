import {BaseHttpResponse} from './base-http-response';
import {SongResponseData} from './song';

interface BaseHttpResponseWithContributorResponseData {
  'data': ContributorResponseData;
}

export interface ContributorResponseData {
  firstName: string;
  lastName: string;
  description: string;
  imgUrl: string;
  contactLink: string;
  seniorContributor: boolean;
  addedDate: string;
  lastModifiedDate: string;
}

export interface MyContributionMetadataResponse {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  songList: SongResponseData[];
}

interface BaseHttpResponseWithSongListResponseData {
  'data': MyContributionMetadataResponse;
}

export type ContributorGetResponse = BaseHttpResponse & BaseHttpResponseWithContributorResponseData;

export type MyContributionsGetResponse = BaseHttpResponse & BaseHttpResponseWithSongListResponseData;
