import {BaseHttpResponse} from './base-http-response';
import {SongResponseDataList} from './song';
import {BasePageableResponse} from './base-pageable-response';

interface BaseHttpResponseWithContributorResponseData {
  'data': ContributorResponseData;
}

export interface ContributorResponseData {
  firstName: string;
  lastName: string;
  description?: string;
  imgUrl: string;
  contactLink?: string;
  seniorContributor: boolean;
  addedDate?: string;
  lastModifiedDate?: string;
}

interface BaseHttpResponseWithSongListResponseData {
  'data': MyContributionMetadataResponse;
}

export type MyContributionMetadataResponse = BasePageableResponse & SongResponseDataList;

export type ContributorGetResponse = BaseHttpResponse & BaseHttpResponseWithContributorResponseData;

export type MyContributionsGetResponse = BaseHttpResponse & BaseHttpResponseWithSongListResponseData;
