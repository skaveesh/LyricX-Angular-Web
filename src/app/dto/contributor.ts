import {BaseHttpResponse} from './base-http-response';

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

export type ContributorGetResponse = BaseHttpResponse & BaseHttpResponseWithContributorResponseData;
